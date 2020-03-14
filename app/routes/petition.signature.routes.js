const signature = require('../controllers/petition.signature.controller');

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/:id/signatures')
        .get(signature.listAll)
        .post(signature.add)
        .delete(signature.delete);
}