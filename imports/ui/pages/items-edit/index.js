import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'
import { Shops } from './../../../api/shops/collection'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsEditPage.onCreated(function(){
	this.ready = new ReactiveVar(false)

	this.itemId = Router.current().params.itemId
	// this.subscribe('singleItem', this.itemId);
	// this.ready.set(Template.instance().subscriptionsReady() );
	//this.ready.set(true);

	this.autorun(()=>{
		//this.ready.set(true);
		// var subscription = itemsCache.subscribe('singleItem', this.itemId)

	 //    if (subscription.ready()){
	 //    	this.ready.set(subscription.ready())
	 //    }
		this.subscribe('singleItem', this.itemId);
		if (Template.instance().subscriptionsReady()){
	    	this.ready.set(true)
	    }
	})
})

Template.itemsEditPage.helpers({
	shop(){
		return Shops.findOne(Meteor.user().shop)
	},
	ready(){
		//alert(Template.instance().ready.get());
		return Template.instance().ready.get()
	},
	item(){
		if (Template.instance().subscriptionsReady() && !Items.findOne(Router.current().params.itemId) ){
			Router.go('shops.mine')
		}
		return Items.findOne(Router.current().params.itemId)
	}
});