import { Meteor } from 'meteor/meteor';

import { Items } from './../../api/items/collection.js'
import { Shops } from './../../api/shops/collection.js'
import { Purchases } from './../../api/purchases/collection.js'
import { Categories } from './../../api/categories/collection.js'

import './../../api/shops/methods.js'

import './../../api/categories/publications.js'
import './../../api/items/publications.js'
import './../../api/shops/publications.js'

Meteor.startup(() => {
	if (Shops.find().count() === 0) {

		const shops = [
			{ title: 'PizzaHot', description: 'blah blah blah', city: 'jeddah' },
			{ title: 'CokkiesHot', description: 'blah blah blah', city: 'jeddah' },
		]

		const categories = [
			{ identifier: 'deserts', label: 'حلويات' },
			{ identifier: 'mashawee', label: 'مشاوي' },
			{ identifier: 'pateseries', label: 'معجنات' }
		]

		categories.forEach(function(category){
			Categories.insert(category)
		})

		shops.forEach(function(shop){
			var shopId = Shops.insert(shop)

			const items = [
				{ title: 'Pizza', description: 'blah blah blah', shop: shopId },
				{ title: 'Cokkies', description: 'blah blah blah', shop: shopId },
			]

			items.forEach(function(item){
				Items.insert(item)
			})

			const purchases = [
				{ notes: 'I want it fresh'},
				{ notes: 'I want it hot'},
				{ notes: 'I want it cool please'},
				{ notes: 'I want it on time please' }
			]

			purchases.forEach(function(item){
				Purchases.insert(item)
			})
		})		

	}
});
