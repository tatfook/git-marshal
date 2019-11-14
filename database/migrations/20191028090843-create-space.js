'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { BIGINT, STRING, INTEGER, DATE } = Sequelize;

        await queryInterface.createTable(
            'spaces',
            {
                id: {
                    type: BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },

                name: {
                    type: STRING(64),
                    unique: true,
                    allowNull: false,
                },

                userId: {
                    type: BIGINT,
                    allowNull: true,
                },

                repoCount: {
                    // repo counter
                    type: INTEGER,
                    allowNull: false,
                    defaultValue: 0,
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

        await queryInterface.addIndex('spaces', { fields: ['userId'] });
    },

    down: queryInterface => {
        return queryInterface.dropTable('spaces');
    },
};
