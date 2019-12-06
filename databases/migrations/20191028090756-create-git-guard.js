'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { BIGINT, STRING, INTEGER, DATE } = Sequelize;

        return queryInterface.createTable(
            'guards',
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

                url: {
                    type: STRING(100),
                    allowNull: false,
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
    },

    down: queryInterface => {
        return queryInterface.dropTable('guards');
    },
};
