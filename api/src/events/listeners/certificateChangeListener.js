"use strict";

const UserRepository = require('../../repository/userRepository');
const log = require('../../../logger').log;
const mkdirp = require('mkdirp');
const path = require('path');
const CertGenerator = require('../../services/certificateGenerator');
/**
 *
 * @param userId
 * @param course
 * @param destination
 */
function createNewCertificate(userId, course, destination) {
    let newFolder = path.dirname(destination);

    UserRepository.findById(userId)
        .then((user) => {
            mkdirp(newFolder, function(error, result) {
                if (error) {
                    log.error(error);
                } else {
                    CertGenerator.generate(user.name, course.name, destination)
                }
            });
        })
        .catch((error) => {
            log.error(error);
        })
        .done();
}


module.exports = {
    createNewCertificate: createNewCertificate
};