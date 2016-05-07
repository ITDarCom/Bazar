import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

Template.adminUsers.helpers({
	users(){
		return Meteor.users.find().fetch()
	}
})
