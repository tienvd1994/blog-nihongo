"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const QuestionSchema = new mongoose.Schema(
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
            type: mongoose.Schema.Types.ObjectId
        },
        type: {
            type: Number
        },
        answers: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        transcript: {
            type: String
        },
    },
    { minimize: false }
);

QuestionSchema.plugin(timestamps);
QuestionSchema.plugin(mongooseStringQuery);

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;

