'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert(
            'admins',
            [
                {
                    username: 'admin',
                    password: bcrypt.hashSync('123123', 10),
                    createdAt: new Date().toLocaleString(),
                    updatedAt: new Date().toLocaleString(),
                },
            ],
            {},
        );
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('admins', null, {});
    },
};
