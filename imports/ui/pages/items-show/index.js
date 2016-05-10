import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsShowPage.onCreated(function(){
	this.itemId = Router.current().params.itemId
	this.subscribe('singleItem', this.itemId)
})

Template.itemsShowPage.helpers({
	data(){
		return Items.findOne(Template.instance().itemId)
	}
})

Template.itemsShowPage.events({
	'click .add-to-cart-btn': function(event, instance){

		Meteor.call('cart.addItem', instance.itemId)
		Router.go('cart')

	}
})