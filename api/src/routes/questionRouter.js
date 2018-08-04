"use strict";

const QuestionController = require('../controllers/questionController');

module.exports = function (server) {

    /**
     * LIST
     */
    server.get('/api/v1/questions', QuestionController.list);

    /**
     * GET
     */
    server.get('/api/v1/questions/:id', QuestionController.one);

    server.post('/api/v1/questions', QuestionController.create);

    server.put('/api/v1/questions/:id', QuestionController.update);

    server.post('/api/v1/questions/createOrUpdate', QuestionController.createOrUpdate);
};