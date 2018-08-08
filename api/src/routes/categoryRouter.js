"use strict";

const CategoryController = require('../controllers/categoryController');
const TestController = require('../controllers/testController');

module.exports = function (server) {

    /**
     * LIST
     */
    server.get('/api/v1/categories', CategoryController.list);

    /**
     * GET
     */
    server.get('/api/v1/categories/:id', CategoryController.one);

    server.post('/api/v1/categories', CategoryController.create);

    server.put('/api/v1/categories/:id', CategoryController.update);

    server.get('/api/v1/categories/:category_friendlyName/tests', TestController.getByCategory);
};