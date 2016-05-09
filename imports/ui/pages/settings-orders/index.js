import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Purchases } from './../../../api/purchases/collection.js'

import './template.html'

Template.settingsOrders.onCreated(function(){
	this.subscribe('orders')
})

Template.settingsOrders.helpers({
	orders: function(){
		return Purchases.find({ status: 'pending' })
	}
})

Template.order.events ({
	'click .accept-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		Meteor.call('orders.process', purchaseId, 'accepted')

	},
	'click .reject-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		Meteor.call('orders.process', purchaseId, 'rejected')
	}
})