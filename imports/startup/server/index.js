import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Items } from './../../api/items/collection.js'
import { Shops } from './../../api/shops/collection.js'
import { Purchases } from './../../api/purchases/collection.js'
import { Categories } from './../../api/categories/collection.js'

import { resetDatabase } from 'meteor/xolvio:cleaner';

import './../../api/shops/methods.js'
import './../../api/purchases/methods.js'

import './../../api/users/publications.js'
import './../../api/categories/publications.js'
import './../../api/items/publications.js'
import './../../api/shops/publications.js'
import './../../api/purchases/publications.js'

import './../../api/generate-data.js'

Meteor.startup(() => {

    resetDatabase();


	const accounts = [
		{ email: 'user@gmail.com', password: 'password' },
		{ email: 'user1@gmail.com', password: 'password' },
		{ email: 'user2@gmail.com', password: 'password' },
		{ email: 'user3@gmail.com', password: 'password' },
		{ email: 'user4@gmail.com', password: 'password' },
	]

	var accountsIds = accounts.map(function(account){
		var accountId = Accounts.createUser(account)
		return accountId
	})

	const shops = [
		{ _id: Random.id(6), title: 'PizzaHot', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0 },
		{ _id: Random.id(6), title: 'CokkiesHot', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0 },
		{ _id: Random.id(6), title: 'MashaweeHot', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0 },
		{ _id: Random.id(6), title: 'Nabil Nafesseh Shop', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0 },
		{ _id: Random.id(6), title: 'McDonalds', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0 },
	]

	const categories = [
		{ identifier: 'deserts', label: 'حلويات' },
		{ identifier: 'mashawee', label: 'مشاوي' },
		{ identifier: 'pateseries', label: 'معجنات' }
	]

	categories.forEach(function(category){
		Categories.insert(category)
	})

	shops.forEach(function(shop, index){
		shop.user = accountsIds[index]
		var shopId = Shops.insert(shop, { getAutoValues : false })

		Meteor.users.update({ _id: accountsIds[index]}, 
			{ $set: { 'profile.hasShop': true, 'profile.shop': shopId } 
		})	

		const items = [
			{ title: `An item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
			{ title: `Another item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
			{ title: `Wiered item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
			{ title: `Popular item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
			{ title: `Bad item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
			{ title: `Excellent item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
			{ title: `Not too bad item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
			{ title: `Great item of ${shop.title}`, description: 'blah blah blah', shop: shopId },
		]

		items.forEach(function(item){
			Items.insert(item)
		})

	})		


});
