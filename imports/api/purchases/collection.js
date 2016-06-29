import { Mongo } from 'meteor/mongo';
 
export const Purchases = new Mongo.Collection('purchases');

SimpleSchema.RegEx.SaudiMobile = /^(009665|9665|\+9665|05|\d)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/i

Purchases.attachSchema(new SimpleSchema({
    _id: {
        type: String,
        optional:true
    },	
    'quantity' : {
        type: Number,
        defaultValue : 1,
        min:1,
        label: function(){
            return TAPi18n.__('quantity')
        }, 
    },
    'notes' : {
        type: String,
        optional:true,
        trim: false,
        label: function(){
            return TAPi18n.__('notes')
        }, 
    },
    item: {
        type: String
    },
    user: {
        type: String
    },
    shop: {
        type: String
    },
    status: {
        type: String,
        label: function(){
            return TAPi18n.__('status')
        }
    },
    createdAt: {
        type: Date
    },
    sentAt: {
        type: Date, optional: true
    },    
    'deliveryInfo.email': { 
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: function(){
            return TAPi18n.__('email')
        }, 
    },
    'deliveryInfo.phone': { 
        type: String,
        regEx: SimpleSchema.RegEx.SaudiMobile,
        label: function(){
            return TAPi18n.__('mobile')
        }, 
    },
	'deliveryInfo.deliveryAddress': { 
        type: String,
        label: function(){
            return TAPi18n.__('address')
        }, 
    },
	'deliveryInfo.deliveryDate': { 
        type: Date,
        label: function(){
            return TAPi18n.__('deliveryDate')
        }
     }
}));
