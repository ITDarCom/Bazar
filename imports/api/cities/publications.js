import {Cities} from './collection'

Meteor.publish('cities', function citiesPublication() {
    //Meteor._sleepForMs(200);
    return Cities.find({}, { sort : { order: 1} });
});
