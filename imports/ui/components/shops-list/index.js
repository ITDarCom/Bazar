import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Shops } from './../../../api/shops/collection'

import './template.html'

Template.shopsList.helpers({
	shops(){
		return Shops.find({})
	}
})
