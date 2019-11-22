const { factory } = require('factory-girl');
const GuardFactory = require('./guard');
const RepoFactory = require('./repo');

module.exports = app => {
    app.factory = factory;
    GuardFactory(app);
    RepoFactory(app);
};
