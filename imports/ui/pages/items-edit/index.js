import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'
import { Shops } from './../../../api/shops/collection'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsEditPage.onCreated(function(){
	this.itemId = Router.current().params.itemId
	this.subscribe('singleItem', this.itemId)
})

Template.itemsEditPage.helpers({
	shop(){
		return Shops.findOne(Meteor.user().shop)
	},
	item(){
		if (Template.instance().subscriptionsReady() && !Items.findOne(Router.current().params.itemId) ){
			Router.go('NotFound')
		}
		return Items.findOne(Router.current().params.itemId)
	}
});