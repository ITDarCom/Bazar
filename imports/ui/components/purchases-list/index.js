import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import { Purchases } from './../../../api/purchases/collection'
import { Items } from './../../../api/items/collection'

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
			case "purchases": return "purchaseItem";
			case "orders": return "orderItem";
			case "sales": return "saleItem";
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
					shop: Meteor.user().shop, 
					status : 'pending'
				}
			break;
			case "sales": 
				selector = { 
					shop: Meteor.user().shop, 
					$or : [
						{ status : 'accepted' },
						{ status : 'rejected' },
					]					
				}
			break;
		}
		return Purchases.find(selector, { sort: { sentAt: -1 }})
	},
	currentChannel(){
		return Template.instance().channel.get()
	}
})

Template.orderItem.events ({
	'click .accept-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		Meteor.call('orders.process', purchaseId, 'accepted')

	},
	'click .reject-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		if (confirm(TAPi18n.__('rejectOrderConfirmation'))){
			Meteor.call('orders.process', purchaseId, 'rejected')			
		}
	}
});

function getItem(itemId){
	return Items.findOne(itemId)
}

Template.orderItem.helpers({
	item(){
		return getItem(Template.instance().data.item)
	},
	member(){
		return Meteor.users.findOne(Template.instance().data.user).username
	},
	total(){
		const data = Template.instance().data
		const item = getItem(data.item)
		if (item) return (item.price * data.quantity)
	},
	modalId(){
		const data = Template.instance().data		
		return `message-modal-${data._id}`
	}	
})

Template.purchaseItem.helpers({
	item(){
		return getItem(Template.instance().data.item)
	},
	statusClass(){
		switch (Template.instance().data.status){
			case "pending": return "list-group-item-warning";
			case "accepted": return "list-group-item-info";
			case "rejected": return "list-group-item-danger";
		}		
	},
	total(){
		const data = Template.instance().data
		const item = getItem(data.item)
		if (item) return (item.price * data.quantity)
	}
})

Template.saleItem.helpers({
	item(){
		return getItem(Template.instance().data.item)
	},
	accepted(){
		return (Template.instance().data.status == 'accepted')
	},
	member(){
		return Meteor.users.findOne(Template.instance().data.user).username
	},
	total(){
		const data = Template.instance().data
		const item = getItem(data.item)
		if (item) return (item.price * data.quantity)
	},
	modalId(){
		const data = Template.instance().data		
		return `message-modal-${data._id}`
	}
})