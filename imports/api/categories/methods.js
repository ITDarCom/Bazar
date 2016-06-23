/**
 * Created by kasem on 01.06.2016.
 */
import { Categories } from './collection'
Meteor.methods({

    "category.insert" : function (categ) {
        var isCategoryExist = Categories.findOne({$or:[{label:categ.label} , {identifier:categ.identifier}]});
        if (this.userId){
            if(! isCategoryExist){
                Categories.insert(categ);
            }
        }

    },
    "category.delete" : function (cityId) {
        Categories.remove({_id : cityId});
    },
    "categoryOrder.up" : function (identifier,newOrder) {

            Categories.update({identifier: identifier},{$set: {order: newOrder}})
    },
    "categoryOrder.down": function (identifier,newOrder) {
        Categories.update({identifier: identifier},{$set: {order: newOrder}})
    }
});