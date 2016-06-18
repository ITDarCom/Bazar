import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Shops } from './../../../api/shops/collection'

Template.settingsShopPage.helpers({
	shop(){
		return Shops.findOne(Meteor.user().shop)
	}
})

Template.settingsShopPage.events({
	'click .delete-shop-btn': function(){
		if (confirm(TAPi18n.__('deleteShopConfirmation'))){
			Meteor.call('shops.remove')
		}
	}
})