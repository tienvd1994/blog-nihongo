"use strict";

/** --------------------------START MODULE DEPENDENCIES ------------------------------*/

const config = require('./config');
const restify = require('restify');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const corsMiddleware = require('restify-cors-middleware');
const log = require('./logger').log;
const filterJsonRequest = require('./src/middlewares/filterJsonRequest');
const filterUnauthorizedRequest = require('./src/middlewares/filterUnauthorizedRequest');
/** ---------------------------END MODULE DEPENDENCIES -------------------------------*/


/** --------------------------START ROUTERS -----------------------------------------*/

const testRouter = require('./src/routes/testRouter');
const categoryRouter = require('./src/routes/categoryRouter');


/** ---------------------------END ROUTERS -----------------------------------------*/

global.__basedir = config.root_dir;
const MAX_UPLOAD_FILE_SIZE = 4 * 1024 * 1024 * 1024;

/**
 * Initialize Server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version,
    log: log
});


/** ---------------------------START MIDDLEWARE ----------------------------------*/


const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: config.cors,
    allowHeaders: ['API-Token', 'Authorization'],
    exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ maxBodySize: MAX_UPLOAD_FILE_SIZE, maxFileSize: MAX_UPLOAD_FILE_SIZE }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());

let logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

server.use(morgan('combined', { stream: accessLogStream }));

server.use(filterUnauthorizedRequest.unless({ path: config.public_url }));

server.get(/\/xdomain\/?.*/, restify.plugins.serveStatic({
    directory: 'assets',
    default: '/index.html'
}));

server.get(/\/files\/?.*/, restify.plugins.serveStatic({
    directory: __basedir,
    default: '/index.html'
}));

server.use(filterJsonRequest);
/** -----------------------------END MIDDLEWARE -----------------------------------*/

/**
 * Start Server, Connect to DB & Require Routes
 */
server.listen(config.port, () => {
    // establish connection to mongodb
    mongoose.Promise = global.Promise;
    if (config.db.authorizationEnabled) {
        mongoose.connect(config.db.uri, { auth: config.db.auth });
    } else {
        mongoose.connect(config.db.uri);
    }

    const db = mongoose.connection;

    db.on('error', (err) => {
        log.error(err);
        process.exit(1);
    });

    db.once('open', () => {
        testRouter(server);
        categoryRouter(server);
        console.log(`Server is listening on port ${config.port}`);
    })
});
