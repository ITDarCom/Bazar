import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'

import './template.html'

import {itemsCache} from './../../components/endless-list/cache.js'

Template.itemsShowPage.onCreated(function(){

	this.ready = new ReactiveVar(false)

	this.itemId = Router.current().params.itemId

	this.autorun(()=>{
		var subscription = itemsCache.subscribe('singleItem', this.itemId)

	    if (subscription.ready()){
	    	this.ready.set(subscription.ready())
	    }
	})

})

Template.itemsShowPage.helpers({
	ready(){
		return Template.instance().ready.get()
	},
	item(){
		return Items.findOne(Template.instance().itemId)
	},
	shop(){
		const item = Items.findOne(Template.instance().itemId)
		return Shops.findOne(item.shop)
	}
})

Template.itemsShowPage.events({
	'click .add-to-cart-btn': function(event, instance){

		Meteor.call('cart.addItem', instance.itemId)
		Router.go('cart')

	}
})