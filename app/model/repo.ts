import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { IRepo } from '../../typings/custom/model';
import { REPO_PREFIX } from '../common/const/redis';

const { BIGINT, STRING, DATE } = Sequelize;

type RepoInstance = typeof Sequelize.Model & {
    new (values?: object, options?: Sequelize.BuildOptions): IRepo;
    cacheRepoByPath(repo: IRepo): Promise<any>;
    getCachedRepoByPath(repoPath: string): Promise<IRepo | null>;
    associate(): void;
};

const schema = {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },

    guardId: {
        type: BIGINT,
        allowNull: false,
    },

    spaceId: {
        type: BIGINT,
        allowNull: false,
    },

    name: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(256),
        allowNull: false,
    },

    path: {
        // repo full path: namespace/repoName
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(512),
        allowNull: false,
    },

    createdAt: {
        type: DATE,
        allowNull: false,
    },

    updatedAt: {
        type: DATE,
        allowNull: false,
    },
};

const schemaOption = {
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
};

export default (app: Application) => {
    const Model = app.model.define('repos', schema, schemaOption) as RepoInstance;

    Model.associate = () => {
        app.model.Repo.belongsTo(app.model.Space);
        app.model.Repo.belongsTo(app.model.Guard);
    };

    Model.addHook('afterCreate', async (instance: IRepo) => {
        // update counter
        await app.model.Space.increment(['repoCount'], {
            by: 1,
            where: { id: instance.spaceId },
        });
        await app.model.Guard.increment(['repoCount'], {
            by: 1,
            where: { id: instance.guardId },
        });
    });

    Model.addHook('beforeDestroy', async (instance: IRepo) => {
        // update counter
        await app.model.Space.increment(['repoCount'], {
            by: -1,
            where: { id: instance.spaceId },
        });
        await app.model.Guard.increment(['repoCount'], {
            by: -1,
            where: { id: instance.guardId },
        });
    });

    Model.cacheRepoByPath = async (repo: IRepo) => {
        // cache for 24 hours
        return app.redis.set(REPO_PREFIX + repo.path, JSON.stringify(repo), 'EX', 3600 * 24); // tslint:disable-line
    };

    Model.getCachedRepoByPath = async (repoPath: string) => {
        const jsonStr = await app.redis.get(REPO_PREFIX + repoPath);
        if (jsonStr) {
            const jsonData = JSON.parse(jsonStr);
            return app.model.Repo.build(jsonData);
        }
        return null;
    };

    return Model;
};
