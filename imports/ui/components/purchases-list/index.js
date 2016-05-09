import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import { Purchases } from './../../../api/purchases/collection'

import './template.html'

Template.purchasesList.onCreated(function(){

	this.autorun(()=>{
		var route = Router.current().route.getName()
		var selector = {}, status

		if (route.match(/cart/)){
			status = 'cart'
		} else {
			status = { $ne: 'cart'}
			//we only subscribe to purchases, cart items are brought in router
			this.subscribe('purchases', status)
		}

		this.selector = { status : status }
	})

})

Template.purchasesList.helpers({
	purchases(){
		return Purchases.find(Template.instance().selector)
	}
})
