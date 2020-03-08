const userPhoto = require('../controllers/user.photo.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/users/:userId/photo')
        .get(userPhoto.retrievePhoto)
        .put(userPhoto.setPhoto)
        .delete(userPhoto.clearPhoto);
}