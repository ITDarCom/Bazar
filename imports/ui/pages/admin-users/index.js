import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


import './template.html';
import './users-table.js'

Template.lastSignInTemplate.helpers({
	getlastSignIn: function () {
		var id = this._id;
		Meteor.call('user.getlastSignIn', this._id, function (err, result) {
			if (!err) {

				var htmlId = '#lastSignIn' + id;
				$(htmlId).text(result);

			}
		})
	}

})


Template.registerdAtTemplate.helpers({

	getRegisterdAt: function () {
		var id = this._id;
		Meteor.call('user.getRegisterdAt', this._id, function (err, result) {
			if (!err) {
				var htmlId = '#registerdAt' + id;
				$(htmlId).text(result);
			}
		})
	}

})


Template.userAdministrativeActions.helpers({
	blocked : function(){
		return Template.instance().data.blocked
	}
});

Template.userAdministrativeActions.events({


	'click .userIdLogIn': function (event) {
		var userId = $(event.target).attr('userid');
		Meteor.call('user.impersonate', userId, function (err) {
			if (!err) {
				Meteor.connection.setUserId(userId);
				Router.go('home');
			}
		});
	},
	'click .deleteUser': function (event) {
		if (confirm('Are you sure')) {
			var userId = $(event.target).attr('userid');
			Meteor.call('user.delete', userId);
		}
	},
	'click .blockUser': function (event) {
		var blockAction = Template.instance().data.blocked ?
			'unblock' : 'block'
		if (confirm('Are you sure you want to '+blockAction+' this user?')) {
			var userId = $(event.target).attr('userid');
			Meteor.call('user.setBlocked', userId, !Template.instance().data.blocked);
		}
	},
	'click .resetPasswd': function (event) {
		var pwd = prompt('Are you sure you want to reset passowrd for'+ Meteor.user().username );

		if (pwd != null) {
			var userId = $(event.target).attr('userid');
			Meteor.call('user.setNewPasswd', userId,pwd,function(err,res){
				if(!err){
					alert("Done");
				}
			});
		}
	}

});

