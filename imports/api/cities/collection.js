import { Mongo } from 'meteor/mongo';

export const Cities = new Mongo.Collection('cities');

SimpleSchema.RegEx.EnglishCityName = /(^[A-Za-z-]*$)/i
SimpleSchema.RegEx.ArabicCityName = /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF\s]*$/i


Cities.allow({
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !! userId;
    }
});



Cities.attachSchema(new SimpleSchema({
    identifier: {
        type: String,
        regEx:/(^[A-Za-z-]*$)/i,
        label: function(){

            return TAPi18n.__('EnglishCityName')
        }
    },
    label: {
        type: String,
        regEx:SimpleSchema.RegEx.ArabicCityName,
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