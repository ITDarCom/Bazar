import { Mongo } from 'meteor/mongo';
 
export const Categories = new Mongo.Collection('categories');

Categories.allow({
	insert: function(userId, doc) {
		// only allow posting if you are logged in
		return !! userId;
	}
});

Categories.attachSchema(new SimpleSchema({
	identifier: {
		type: String,
		label: function(){

			return TAPi18n.__('EnglishName')
		}
	},
	label: {
		type: String,
		label:function(){

			return TAPi18n.__('ArabicName')
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