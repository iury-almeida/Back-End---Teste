'use strict';

const reviewController = require('./reviewController');

module.exports = (app) => {
    app.post('/review', reviewController.create);
    app.get('/review', reviewController.select);
    app.get('/review/:id', reviewController.selectById);
}