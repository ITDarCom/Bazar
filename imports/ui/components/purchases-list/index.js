import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Purchases } from './../../../api/purchases/collection'

import './template.html'

Template.purchasesList.helpers({
	purchases(){
		return Purchases.find({})
	}
})
