import { Mongo } from 'meteor/mongo';
 
export const Items = new Mongo.Collection('items');

import {Shops} from "./../shops/collection"

Items.attachSchema(new SimpleSchema({
    _id: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                var id = Random.id(6);
                while (Items.findOne(id)) {
                    id = Random.id(6);
                }
                return id;
            }
            else
                this.unset();
        }
    },
    shop: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.user().profile.shop;
            }
            if (this.isUpdate) {
                this.unset(); // we should unset every change to this field
            }
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
    },        	
	title: {
		type: String,
		label: "Title",
		max: 200
	},
	description: {
		type: String,
		label: "Description"
	},
	city: {
		type: String,
		label: "City",
		autoValue: function () {
		    if (this.isInsert) {
		        var shop = Shops.findOne(Meteor.user().profile.shop)
		        return shop.city
		    }
		    if (this.isUpdate) {
		        this.unset(); // we should unset every change to this field
		    }
		}			
	},
	price: {
		type: Number,
		label: "Price"
	},
	category: {
		type: String,
		label: "Category"	
	},
    'thumbnails.$.url': {
        type: String,
        label: "Category"   
    },
}));