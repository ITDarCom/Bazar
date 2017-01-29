import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

Template.settingsAccountPage.onCreated(function(){
})

Template.settingsAccountPage.helpers({

})

Template.accountInfoForm.onCreated(function(){
	this.schema = new SimpleSchema({
		'username': { 
		    type: String,
		    min:4,
		    max:20,
		    label: function(){
		        return TAPi18n.__('username')
		    }, 
		},
		'email': { 
		    type: String,
			regEx: SimpleSchema.RegEx.Email,
		    label: function(){
		        return TAPi18n.__('email')
		    }, 
		},
		'phone': { 
		    type: String,
		    regEx: SimpleSchema.RegEx.SaudiMobile,
		    label: function(){
		        return TAPi18n.__('mobile')
		    }, 
		}
	});
})

Template.accountInfoForm.helpers({
	schema(){
		return Template.instance().schema
	},
	defaultValues(){
		return {
			_id: Meteor.userId(),
			username: Meteor.user().username,
			email: Meteor.user().emails[0].address,
			phone: Meteor.user().phone
		}
	}
})