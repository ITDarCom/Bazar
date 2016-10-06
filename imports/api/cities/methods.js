
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

        Cities.remove({_id : cityId});
    },

    "city.canDelete": function(cityId){

        const city = Cities.findOne(cityId)

        if (Shops.findOne({city: city.identifier })){
            return false;
        } else {
            return true;
        }

    }

});