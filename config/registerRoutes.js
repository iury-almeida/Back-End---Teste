'use strict';

const serviceProviderRoute = require('../core/serviceProvider/serviceProviderRoutes');
const reviewRoute = require('../core/review/reviewRoutes');

module.exports = (app) => {
    serviceProviderRoute(app);
    reviewRoute(app);
}