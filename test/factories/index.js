const { factory } = require('factory-girl');
const GuardFactory = require('./guard');
const SpaceFactory = require('./space');

module.exports = app => {
    app.factory = factory;
    GuardFactory(app);
    SpaceFactory(app);
};
