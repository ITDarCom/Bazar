/**
 * Created by kasem on 01.06.2016.
 */
import { Categories } from './collection'
Meteor.methods({

    "category.insert" : function (doc) {
     if (this.userId){
         Categories.insert(doc);
     }
    },
    "deleteCity" : function (cityId) {
        Categories.remove({_id : cityId});
    }
});