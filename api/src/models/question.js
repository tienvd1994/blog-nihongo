"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const QuestionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId
        },
        creator: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        media: {
            type: String
        },
        type: {
            type: Number
        }
    },
    { minimize: false }
);

QuestionSchema.plugin(timestamps);
QuestionSchema.plugin(mongooseStringQuery);

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;

