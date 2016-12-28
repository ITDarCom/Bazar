
import { Cities } from './collection'

import { Shops } from './../shops/collection'


Meteor.methods({

    "city.insert" : function (city) {
        var isCityExist = Cities.findOne({$or:[{label:city.label} , {identifier:city.identifier}]});
        if (this.userId){
            if(! isCityExist){
                Cities.insert(city);
            }
        }
    },
    "city.delete" : function (cityId) {

        const city = Cities.findOne(cityId)

        if (Shops.findOne({city: city.identifier })){
            throw new Error('Cannot delete a city that has at least one item')
        }

        const oldOrder = city.order

        const toBeUpdated = Cities.find({ order: { $gt: oldOrder }}).fetch()

        toBeUpdated.forEach(function(cat){
            Cities.update({_id: cat._id}, { $inc: {'order': -1 }}, {strict: false})
        })        

        Cities.remove({_id : cityId});
    },

    "city.canDelete": function(cityId){

        const city = Cities.findOne(cityId)

        if (Shops.findOne({city: city.identifier })){
            return false;
        } else {
            return true;
        }

    },
    "cityOrder.up" : function (identifier) {

        const city = Cities.findOne({identifier: identifier})
        const oldOrder = city.order
        const newOrder = city.order - 1

        if (newOrder > 0){
            Cities.update({ order: newOrder }, {$set: {order: oldOrder }})
            Cities.update({identifier: identifier},{$set: {order: newOrder}})            
        }

    },
    "cityOrder.down": function (identifier) {

        const city = Cities.findOne({identifier: identifier})
        const oldOrder = city.order
        const newOrder = city.order + 1

        const count = Cities.find().count()
        
        if (newOrder <= count){
            Cities.update({ order: newOrder }, {$set: {order: oldOrder }})
            Cities.update({identifier: identifier},{$set: {order: newOrder}})            
        }    
    }    

});