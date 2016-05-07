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
		label: "Identifier"
	},
	label: {
		type: String,
		label: "Label"
	}
}))