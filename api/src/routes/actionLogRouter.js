"use strict";

const ActionLogController = require('../controllers/actionLogController');

module.exports = function(server) {

    /**
     * LIST
     */
    server.get('/api/v1/logs', ActionLogController.list);

    /**
     * GET
     */
    server.get('/api/v1/logs/:logs_id', ActionLogController.one);
};