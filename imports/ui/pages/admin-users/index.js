import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

Template.adminUsersPage.helpers({
	users(){
		return Meteor.users.find().fetch()
	}
});
