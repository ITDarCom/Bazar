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
    "item.favoriteIt" : function (itemId,favoriteStatus){
        check(itemId, String);
        check(favoriteStatus, Boolean);
        if (this.userId){
            if(favoriteStatus) {

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
        this.unblock();
        check(userId, String);
            if (Meteor.user().isAdmin) {
                //Fiber = Npm.require('fibers');
                //Fiber(function(){
                //    console.log("I am in fiber")
                //    //Meteor.users.remove({_id: userId});
                //}).run();
                //console.log("I am out bindEnvironment")
                //Meteor.bindEnvironment(function (error, result) {
                //    console.log("I am in bindEnvironment")
                //    Meteor.users.remove({_id: userId});
                //});

                setTimeout(function () {
                    Fiber = Npm.require('fibers');
                    Fiber(function(){
                        console.log("I am in fiber")
                        Meteor.users.remove({_id: userId});
                    }).run();
                },1000)

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

    }
})
