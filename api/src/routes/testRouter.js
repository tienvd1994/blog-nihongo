"use strict";

const TestController = require('../controllers/testController');

module.exports = function (server) {
    
    server.get('/api/v1/tests', TestController.list);
    
    server.get('/api/v1/tests/:id', TestController.one);

    server.post('/api/v1/tests', TestController.create);

    server.put('/api/v1/tests/:id', TestController.update);
};