import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Shops } from './../../../api/shops/collection'
import { Cities } from './../../../api/cities/collection'

Template.shopsNew.helpers({
	formCollection(){
		return Shops;
	},
	cities(){
		return Cities.find({}).map(function(city){
			return {
				label: city.label,
				value: city.identifier
			}
		})
	}
})
