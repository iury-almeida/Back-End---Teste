'use strict';

const serviceProviderController = require('./serviceProviderController');

module.exports = (app) => {
    app.post('/service-provider', serviceProviderController.create);
    app.put('/service-provider/:id', serviceProviderController.update);
    app.get('/service-provider', serviceProviderController.select);
    app.get('/service-provider/:id', serviceProviderController.selectById);
    app.delete('/service-provider/:id', serviceProviderController.remove);
    app.get('/ping', (req, res) => {
        res.send(new Date());
    });
}