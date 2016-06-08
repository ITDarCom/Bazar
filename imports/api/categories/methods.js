/**
 * Created by kasem on 01.06.2016.
 */
import { Categories } from './collection'
Meteor.methods({

    "category.insert" : function (categ) {
        var isCategoryExist = Categories.findOne({label:categ.label , identifier:categ.identifier});
        if (this.userId){
            if(! isCategoryExist){
                Categories.insert(categ);
            }
        }

    },
    "deleteCategory" : function (cityId) {
        Categories.remove({_id : cityId});
    }
});