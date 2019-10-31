'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert(
            'guards',
            [
                {
                    name: 'dev',
                    url: 'http://10.28.18.24:7000/api/v0',
                    createdAt: new Date().toLocaleString(),
                    updatedAt: new Date().toLocaleString(),
                },
            ],
            {},
        );
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('guards', null, {});
    },
};
