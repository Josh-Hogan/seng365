const user = require('../controllers/user.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/users/register')
        .post(user.register);

    app.route(app.rootUrl + '/users/login')
        .post(user.login);

    app.route(app.rootUrl + '/users/logout')
        .post(user.logout);

    app.route(app.rootUrl + '/users/:userId')
        .get(user.getUser);

    app.route(app.rootUrl + '/users/:userId')
        .patch(user.updateDetails);
};