import { Mongo } from 'meteor/mongo';
 
export const Categories = new Mongo.Collection('categories');

SimpleSchema.RegEx.EnglishCategoryName = /(^[A-Za-z-]*$)/i
SimpleSchema.RegEx.ArabicCategoryName = /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF\s]*$/i

Categories.allow({
	insert: function(userId, doc) {
		// only allow posting if you are logged in
		return !! userId;
	}
});

Categories.attachSchema(new SimpleSchema({
	identifier: {
		type: String,
		regEx:SimpleSchema.RegEx.EnglishCategoryName,
		label: function(){

			return TAPi18n.__('EnglishCategoryName')
		}
	},
	label: {
		type: String,
		regEx:SimpleSchema.RegEx.ArabicCategoryName,
		label:function(){

			return TAPi18n.__('ArabicCategoryName')
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