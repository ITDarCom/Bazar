import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Purchases } from './../../../api/purchases/collection.js'

import './template.html'

Template.settingsOrdersPage.onCreated(function(){
	this.subscribe('orders')
})

Template.settingsOrdersPage.helpers({
	orders: function(){
		return Purchases.find({ status: 'pending' })
	}
})
