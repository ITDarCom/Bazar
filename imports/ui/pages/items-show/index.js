import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsShow.onCreated(function(){
	this.subscribe('singleItem', Router.current().params.itemId)
})

Template.itemsShow.helpers({
	data(){
		return Items.findOne(Router.current().params.itemId)
	}
})