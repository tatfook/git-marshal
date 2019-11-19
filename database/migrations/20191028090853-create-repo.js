'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { BIGINT, STRING, DATE } = Sequelize;

        await queryInterface.createTable(
            'repos',
            {
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
                    type: STRING(256),
                    allowNull: false,
                },

                path: {
                    // repo full path: namespace/repoName
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
            },
            {
                underscored: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_bin',
            },
        );

        await queryInterface.addIndex('repos', { fields: ['guardId'] });
        await queryInterface.addIndex('repos', { fields: ['spaceId'] });
        await queryInterface.addIndex('repos', { fields: ['path'], unique: true });
    },

    down: queryInterface => {
        return queryInterface.dropTable('repos');
    },
};
