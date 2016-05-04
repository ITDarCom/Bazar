import { Mongo } from 'meteor/mongo';
 
export const Cities = new Mongo.Collection('cities');

Cities.allow({
	insert: function(userId, doc) {
		// only allow posting if you are logged in
		return !! userId;
	}
});

Cities.attachSchema(new SimpleSchema({
	identifier: {
		type: String,
		label: "Identifier"
	},
	label: {
		type: String,
		label: "Label"
	}
}))