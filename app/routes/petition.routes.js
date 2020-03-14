const petition = require('../controllers/petition.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/petitions')
        .get(petition.listAll)
        .post(petition.add);

    app.route(app.rootUrl + '/petitions/categories')
        .get(petition.categoriesList);
        
    app.route(app.rootUrl + '/petitions/:id')
        .get(petition.listSingle)
        .patch(petition.patch)
        .delete(petition.delete);

        
};



