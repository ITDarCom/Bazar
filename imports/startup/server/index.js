import { Meteor } from 'meteor/meteor';

import { Items } from './../../api/items/collection.js'
import { Shops } from './../../api/shops/collection.js'
import { Purchases } from './../../api/purchases/collection.js'

Meteor.startup(() => {
	if (Shops.find().count() === 0) {

		const shops = [
			{ title: 'PizzaHot' },
			{ title: 'CokkiesHot' },
		]

		shops.forEach(function(shop){
			Shops.insert(shop)

			const data = [
				{ title: 'Pizza' },
				{ title: 'Cokkies' },
			]

			data.forEach(function(item){
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
