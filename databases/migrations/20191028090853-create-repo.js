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

                space: {
                    type: STRING(48),
                    allowNull: false,
                },

                name: {
                    type: STRING(128),
                    allowNull: false,
                },

                path: {
                    // repo full path: space/name
                    type: STRING(180),
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
        await queryInterface.addIndex('repos', { fields: ['space', 'name'], unique: true });
        await queryInterface.addIndex('repos', { fields: ['path'], unique: true });
    },

    down: queryInterface => {
        return queryInterface.dropTable('repos');
    },
};
