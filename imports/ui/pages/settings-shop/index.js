import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Shops } from './../../../api/shops/collection'

Template.settingsShopPage.helpers({
	shop(){
		return Shops.findOne(Meteor.user().profile.shop)
	}
})

Template.settingsShopPage.events({
	'click .delete-shop-btn': function(){
		if (confirm('WARNING: Are you sure you want to delete your shop?')){
			Meteor.call('shops.remove')
		}
	}
})