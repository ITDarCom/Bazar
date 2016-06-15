import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
	'accounts.update'(modifier, documentId){
		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		modifier.$set.emails = [ {address: modifier.$set.email} ]
		Meteor.users.update({ _id: documentId }, modifier, documentId);
	},
    "item.favoriteIt" : function (itemId){
        check(itemId, String);
        if (this.userId){
            if(!Meteor.users.findOne({_id: this.userId, favorites: {$in: [itemId]}})) {

                Meteor.users.upsert({_id: this.userId}, {$addToSet: {favorites: itemId}});

            }
            else {

                Meteor.users.update({_id: this.userId}, {$pull: {favorites: itemId}});

            }
        }
    },
    'user.impersonate': function(userId) {
        check(userId, String);

        if (!Meteor.users.findOne(userId))
            throw new Meteor.Error(404, 'User not found');
        if (!Meteor.user().isAdmin)
            throw new Meteor.Error(403, 'Permission denied');

        this.setUserId(userId);
    },
    'user.delete': function (userId) {

        check(userId, String);
            if (Meteor.user().isAdmin) {
                    Meteor.users.remove({_id: userId});
            }
    },
    'user.setBlocked' : function(userId, blocked){
        check(userId, String);
        check(blocked, Boolean);

        if (Meteor.users.findOne(this.userId).isAdmin){
            if (Meteor.users.findOne(userId)) {
                Meteor.users.update({ _id: userId }, { $set: { blocked: blocked } })
            }
        }
    },
    'user.setNewPasswd': function (userId,pwd) {
        if (Meteor.users.findOne(this.userId).isAdmin) {
            Accounts.setPassword(userId, pwd)
        }

    },
    'user.getRegisterdAt': function (id) {
        var user = Meteor.users.findOne(id);
        if (user.registerdAt) {
            return moment(user.registerdAt).format('dddd DD-MM hh:mm');
        }

    },
    'user.getlastSignIn': function (id) {
        var user = Meteor.users.findOne(id);
        if (user.lastSignIn) {
            return moment(user.lastSignIn).format('dddd DD-MM hh:mm')
        }
    },
    'user.setLastSingnin' : function (userId){
        Meteor.users.upsert({_id: this.userId}, {$set: {lastSignIn: new Date()}});
    }

})
