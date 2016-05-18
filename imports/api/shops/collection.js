import { Mongo } from 'meteor/mongo';
 
export const Shops = new Mongo.Collection('shops');

Shops.attachSchema(new SimpleSchema({
    _id: {
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
    user: {
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
		label: "City"
	},
    logo: {
        type: String,
        label: "Logo",
        defaultValue: '/kfc.jpg'
    },    
    unreadOrders: {
        type: Number,
        defaultValue: 0
    }    
}));