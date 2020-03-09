const petitions = require('../controllers/petitions.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/petitions')
        .get(petitions.listAll)
        .post(petitions.add);

    app.route(app.rootUrl + '/petitions/:id')
        .get(petitions.listSingle)
        .patch(petitions.patch)
        .delete(petitions.delete);

    app.route(app.rootUrl + '/petitions/categories')
        .post(petitions.categoriesList);
        
};



