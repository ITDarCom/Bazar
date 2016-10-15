import { Mongo } from 'meteor/mongo';
import { Images } from './../images'
 
export const Shops = new Mongo.Collection('shops');
export const ShopsRemoved = new Mongo.Collection('shopsremoved');

Shops.attachSchema(new SimpleSchema({
    '_id': {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                var id = Random.id(6);
                while (Shops.findOne(id)) {
                    id = Random.id(6);
                }
                return id;
            }
            else
                this.unset();
        }
    },
    'user': {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.userId();
            }
            if (this.isUpdate) {
                this.unset(); // we should unset every change to this field
            }
        }
    },
    'createdAt': {
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
	'title': {
		type: String,
        label: function(){
            return TAPi18n.__('title')
        },		
		max: 200, unique: true,
        custom: function () {
            if (Meteor.isClient) {
                Meteor.call("shopTitleAvailable", this.value, function (error, result) {
                    if (!result) {
                        Shops.simpleSchema().namedContext("insertShopForm").addInvalidKeys([{name: "title", type: "shopNotUnique"}]);
                    }
                });
            }
        }        
	},
    'titleLowerCase': {
        type: String,
        max: 200, unique: true, optional:true,
        autoValue: function () {
            if (this.field('title').isSet){
                return this.field('title').value.toLowerCase()                
            }
        }
    },
	'description': {
		type: String,
        label: function(){
            return TAPi18n.__('description')
        }		
	},
	'city': {
		type: String,
		label: function(){
            return TAPi18n.__('city')
        }
	},
    'logo.url': {
        type: String,
        label: "Logo",
        defaultValue: '/shop-logo.png'
    },
    'logo.imageId': {
        type: String,
        label: function(){
            return TAPi18n.__('shopLogo')
        },               
    },
    'unreadOrders': {
        type: Number,
        defaultValue: 0
    },
    'totalOrders': {
        type: Number,
        defaultValue: 0, optional:true
    },
    'totalSales': {
        type: Number,
        defaultValue: 0, optional:true
    },         
    'isHidden': {
        type:Boolean,
        autoValue: function () {
            if (this.isInsert){
                return false;
            }
            if (this.isUpdate){
                return this.value;
            }
        }
    },
    isRemoved: {
        type:Boolean, defaultValue:false, optional:true
    }
}));