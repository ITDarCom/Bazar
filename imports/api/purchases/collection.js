import { Mongo } from 'meteor/mongo';
 
export const Purchases = new Mongo.Collection('purchases');

Purchases.attachSchema(new SimpleSchema({
    _id: {
        type: String,
        optional:true
    },	
    'quantity' : {
        type: Number,
        defaultValue : 1,
        min:1,
    },
    'notes' : {
        type: String,
        optional:true
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
        type: String
    },
    createdAt: {
        type: Date
    },
    'deliveryInfo.email': { type: String},
	'deliveryInfo.phone': { type: String},
	'deliveryInfo.deliveryAddress': { type: String},
	'deliveryInfo.deliveryDate': { type: Date}
}));
