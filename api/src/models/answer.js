"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const AnswerSchema = new mongoose.Schema(
    {
        question: {
            type: mongoose.Schema.Types.ObjectId
        },
        image: {
            type: String
        },
        media: {
            type: String
        }
    },
    { minimize: false }
);

AnswerSchema.plugin(timestamps);
AnswerSchema.plugin(mongooseStringQuery);

const Answer = mongoose.model('Answer', AnswerSchema);
module.exports = Answer;

