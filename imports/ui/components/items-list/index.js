import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsList.helpers({
	items(){
		return Items.find({})
	}
})
