"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const ContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    { minimize: false }
);

ContactSchema.plugin(timestamps);
ContactSchema.plugin(mongooseStringQuery);

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;

