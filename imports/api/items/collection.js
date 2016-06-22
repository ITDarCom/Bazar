import { Mongo } from 'meteor/mongo';
 
export const Items = new Mongo.Collection('items');

import {Shops} from "./../shops/collection"

Items.attachSchema(new SimpleSchema({
    _id: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                var id = Math.floor((Math.random() * 10000) + 1);
                while (Items.findOne(id)) {
                    id = Math.floor((Math.random() * 10000) + 1);
                }
                return id.toString();
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
        label: function(){
            return TAPi18n.__('title')
        },   
		max: 200
	},
	description: {
		type: String,
		label: function(){
            return TAPi18n.__('description')
        },
	},
	city: {
		type: String,
		label: function(){
            return TAPi18n.__('city')
        },
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
		label: function(){
            return TAPi18n.__('price')
        },
	},
	category: {
		type: String,
		label: function(){
            return TAPi18n.__('category')
        },	
	},
    'thumbnails.$.url': {
        type: String 
    },
    isHidden: {
        type:Boolean,
        autoValue: function () {
            if (this.isInsert){
                return false;
            }
            if (this.isUpdate){
                return this.value;
            }
        }
    }
}));