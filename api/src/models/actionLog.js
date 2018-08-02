"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const ActionConstant = require('../constant/actionConstant');

const ActionLogSchema = new mongoose.Schema(
    {
        creator: {
            type: String,
            required: true,
        },
        actionType: {
            type: String,
            required: true,
            enum: [ActionConstant.CREATE_ACTION, ActionConstant.READ_ACTION, ActionConstant.UPDATE_ACTION, ActionConstant.DELETE_ACTION]
        },
        ip: {
            type: String,
            required: true,
        },
        objectName:{
            type: String,
            default: '',
        },
        objectType:{
            type: String,
            default: '',
        },
        objectId:{
            type: String,
            default: '',
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        },
        reason: {
            type: String,
        },
        role: {
            type: String,
            required: true
        }

    },
    { minimize: false }
);

ActionLogSchema.plugin(timestamps);
ActionLogSchema.plugin(mongooseStringQuery);

const ActionLog = mongoose.model('ActionLog', ActionLogSchema);
module.exports = ActionLog;

