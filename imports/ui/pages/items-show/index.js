import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsShow.onCreated(function(){
	this.itemId = Router.current().params.itemId
	this.subscribe('singleItem', this.itemId)
})

Template.itemsShow.helpers({
	data(){
		return Items.findOne(Template.instance().itemId)
	}
})

Template.itemsShow.events({
	'click .add-to-cart-btn': function(event, instance){

		Meteor.call('cart.addItem', instance.itemId)
		Router.go('cart')

	}
})