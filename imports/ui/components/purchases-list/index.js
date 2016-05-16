import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import { Purchases } from './../../../api/purchases/collection'

import './template.html'

Template.purchasesList.onCreated(function(){

	this.channel = new ReactiveVar()

	//subscribing to the appropriate channel on server
	this.autorun(()=>{
		var route = Router.current().route.getName()
		var channel = route.match(/settings.(\w+)/)[1] //purchases, orders or sales
		this.subscribe(channel)
		this.channel.set(channel)
	})
})

Template.purchasesList.helpers({
	purchaseTemplate(){
		switch (Template.instance().channel.get()){
			case "purchases": return "purchasesItem";
			case "orders": return "ordersItem";
			case "sales": return "salesItem";
		}
	},
	purchases(){
		let selector = {}
		switch (Template.instance().channel.get()){
			case "purchases": 
				selector = { user: Meteor.userId(), status : { $ne : 'cart'}}
			break;
			case "orders": 
				selector = { 
					shop: Meteor.user().profile.shop, 
					status : 'pending'
				}
			break;
			case "sales": 
				selector = { 
					shop: Meteor.user().profile.shop, 
					$or : [
						{ status : 'accepted' },
						{ status : 'rejected' },
					]					
				}
			break;
		}
		return Purchases.find(selector)
	},
	currentChannel(){
		return Template.instance().channel.get()
	}
})

Template.ordersItem.events ({
	'click .accept-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		Meteor.call('orders.process', purchaseId, 'accepted')

	},
	'click .reject-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		if (confirm("Are you sure you want to reject this order?")){
			Meteor.call('orders.process', purchaseId, 'rejected')			
		}
	}
})
