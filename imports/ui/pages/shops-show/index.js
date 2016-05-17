import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Shops } from './../../../api/shops/collection'

import './template.html'

Template.shopsShowPage.onCreated(function(){
	this.subscribe('singleShop', Router.current().params.shop)
})

Template.shopsShowPage.helpers({
	shop(){
		return Shops.findOne(Router.current().params.shop)
	}
})