import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Cities } from './../../../api/cities/collection'

Template.adminCities.helpers({
	formCollection(){
		return Cities;
	},
	cities(){
		return Cities.find({})
	}
})
