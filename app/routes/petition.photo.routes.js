const photo = require('../controllers/petition.photo.controller');

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/:id/photo')
        .get(photo.getPhoto)
        .put(photo.setPhoto);
}