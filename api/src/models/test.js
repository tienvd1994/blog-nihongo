"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const TestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        friendlyName: {
            type: String,
            required: true
        },
        content: {
            type: String
        },
        category: {
            type: mongoose.Schema.Types.Mixed
        },
        type: {
            type: Number
        },
        questions: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        transcript: {
            type: String
        },
    },
    { minimize: false }
);

TestSchema.plugin(timestamps);
TestSchema.plugin(mongooseStringQuery);

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;

