import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

import { Shops } from './../../../api/shops/collection'

AutoForm.addHooks('insertShopForm', {
	onSuccess: function(formType, result){
		Router.go('shops.show', { shop: result })
	}

}, true);

Template.shopsNewPage.helpers({
	formCollection(){
		return Shops;
	},
	cities: function () {
	return [
		{
			optgroup: "East coast",
			options: [
				{label: "jeddah", value: "jeddah"},
				{label: "mecca", value: "mecca"},
			]
		},
		{
			optgroup: "Middle",
			options: [
				{label: "riyad", value: "riyad"}
			]
		}
	];
	}
})