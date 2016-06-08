import { Mongo } from 'meteor/mongo';

export const Cities = new Mongo.Collection('cities');


Cities.attachSchema(new SimpleSchema({
    identifier: {
        type: String,
        label: function(){

            return TAPi18n.__('EnglishCityName')
        }
    },
    label: {
        type: String,
        label:function(){

            return TAPi18n.__('ArabicCityName')
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            if (this.isUpdate) {
                this.unset(); // we should unset every change to this field
            }
        }
    }
}));