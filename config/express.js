const express = require('express');
const bodyParser = require('body-parser');
const { allowCrossOriginRequestsMiddleware } = require('../app/middleware/cors.middleware');


module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.rootUrl = '/api/v1';

    // MIDDLEWARE
    app.use(allowCrossOriginRequestsMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({ type: 'text/plain', limit: '5mb' }));  // for the /executeSql endpoint
    app.use(bodyParser.raw({ type: 'image/jpeg', limit: '5mb' })); //for images
    app.use(bodyParser.raw({ type: 'image/png', limit: '5mb' }));  //for images
    app.use(bodyParser.raw({ type: 'image/gif', limit: '5mb' }));  //for images
    // DEBUG (you can remove these)
    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });

    app.get('/', function (req, res) {
        res.send({ 'message': 'Hello World!' })
    });

    // ROUTES
    require('../app/routes/backdoor.routes')(app);
    require('../app/routes/user.routes')(app);
    require('../app/routes/user.photo.routes')(app);
    require('../app/routes/petition.routes')(app);
    require('../app/routes/petition.signature.routes')(app);
    require('../app/routes/petition.photo.routes')(app);

    return app;
};
