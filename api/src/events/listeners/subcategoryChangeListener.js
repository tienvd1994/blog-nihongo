"use strict";

const SubCategoryRepository = require('../../repository/subCategoryRepository');
const CategoryRepository = require('../../repository/categoryRepository');


/**
 * even listener create section
 * @param category
 */
function updateSubcategories (category) {
    SubCategoryRepository.getSubCategoriesByCategory(category)
        .then(function (subcategories) {
            CategoryRepository
                .updateByFriendlyName(category, { 'subCategories' : subcategories })
                .catch(function (error) {
                    console.log(error);
                }).done()
        })
        .catch(function (error) {
            console.log(error);
        }).done()
}

module.exports = {
    updateSubcategories: updateSubcategories
};