import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router';

import './template.html'

Template.cart.events({
	'click .submit-cart-btn': function(event, instance){
		Meteor.call('purchases.submitCart')
		Router.go('settings.purchases')
	}
})