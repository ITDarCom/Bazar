/**
 * Created by kasem on 01.06.2016.
 */
import { Categories } from './collection'

import { Items } from './../items/collection'

Meteor.methods({

    "category.insert" : function (categ) {
        var isCategoryExist = Categories.findOne({$or:[{label:categ.label} , {identifier:categ.identifier}]});
        if (this.userId){
            if(! isCategoryExist){
                Categories.insert(categ);
            }
        }

    },
    'category.update'(modifier, documentId){

        const oldIdentifier = Categories.findOne(documentId).identifier

        if (Categories.update({ _id: documentId }, modifier) == 1 ){

            //update all old items to the new category
            const newIdentifier = Categories.findOne(documentId).identifier
            if (newIdentifier != oldIdentifier){
                Items.update({ category: oldIdentifier }, 
                    { $set: { category: newIdentifier}}, 
                    { multi: true })
            }
        }
    },
    "category.delete" : function (id) {

        const category = Categories.findOne(id)

        if (Items.findOne({ category: category.identifier })){
            throw new Error('Cannot delete a category that has at least one item')
        }

        const oldOrder = category.order

        const toBeUpdated = Categories.find({ order: { $gt: oldOrder }}).fetch()

        toBeUpdated.forEach(function(cat){
            Categories.update({_id: cat._id}, { $inc: {'order': -1 }}, {strict: false})
        })

        Categories.remove({_id : id});
    },
    "category.canDelete": function(id){
        const category = Categories.findOne(id)

        if (Items.findOne({ category: category.identifier })){
            return false;
        } else {
            return true;
        }      
    },
    "categoryOrder.up" : function (identifier) {

        const category = Categories.findOne({identifier: identifier})
        const oldOrder = category.order
        const newOrder = category.order - 1

        if (newOrder > 0){
            Categories.update({ order: newOrder }, {$set: {order: oldOrder }})
            Categories.update({identifier: identifier},{$set: {order: newOrder}})            
        }

    },
    "categoryOrder.down": function (identifier) {
        const category = Categories.findOne({identifier: identifier})
        const oldOrder = category.order
        const newOrder = category.order + 1

        const count = Categories.find().count()
        
        if (newOrder <= count){
            Categories.update({ order: newOrder }, {$set: {order: oldOrder }})
            Categories.update({identifier: identifier},{$set: {order: newOrder}})            
        }    
    }
});