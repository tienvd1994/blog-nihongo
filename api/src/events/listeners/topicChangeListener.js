"use strict";

const SubCategoryRepository = require('../../repository/subCategoryRepository');
const TopicRepository = require('../../repository/topicRepository');
const EventDispatcher = require('../dispatcher');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const SubcategoryChangeListener = require('./subcategoryChangeListener');

/**
 * even listener create section
 * @param subcategory
 */
function updateTopics (subcategory) {
    TopicRepository.getTopicsBySubcategory(subcategory)
        .then(function (topics) {
            SubCategoryRepository
                .updateByFriendlyName(subcategory, { 'topics' : topics })
                .then((updated) => {
                        SubCategoryRepository.findByFriendlyName(subcategory)
                            .then((item) => {
                                eventEmitter.once('ATI_SUBCATEGORY_UPDATED', SubcategoryChangeListener.updateSubcategories);
                                eventEmitter.emit('ATI_SUBCATEGORY_UPDATED', item.category);
                                // EventDispatcher.updateSubcategoryEvent(item.category)
                            })
                            .catch(function (error) {
                                console.log(error);
                            }).done();
                })
                .catch(function (error) {
                    console.log(error);
                }).done()
        })
        .catch(function (error) {
            console.log(error);
        }).done()
}

module.exports = {
    updateTopics: updateTopics
};