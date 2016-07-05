
import { Cities } from './collection'

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
        Cities.remove({_id : cityId});
    }
});