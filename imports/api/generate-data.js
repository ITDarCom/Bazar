import { Meteor } from 'meteor/meteor';
//import { Factory } from 'meteor/factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Promise } from 'meteor/promise';

/*const createList = (userId) => {
    const list = Factory.create('list', { userId });
    _.times(3, () => Factory.create('todo', { listId: list._id }));
    return list;
};*/

import { Accounts } from 'meteor/accounts-base';
import { Items } from './items/collection.js'
import { Shops } from './shops/collection.js'
import { Purchases } from './purchases/collection.js'
import { Categories } from './categories/collection.js'

Meteor.methods({
    getCategories(){
        return Categories.find().fetch()
    },
    getCartItems(){
        return Purchases.find({ status: 'cart', user: this.userId }).fetch()
    },    
    getItem(){
        return Items.findOne()
    },
    createUserWithShop(userOptions, shopOptions){
        const userId = Accounts.createUser(userOptions)
        this.setUserId(userId)
        Meteor.call('shops.insert', shopOptions)        
        return userId
    }, 
    generateItems(count, options){

        const opts = options || {}


        for (var i = 0; i < count; i++) {
            
            const shop = Shops.findOne()
            const category = opts.category? opts.category : Categories.findOne().identifier
            const city = opts.city? opts.city : shop.city
            
            var item = { 
                _id: Random.id(6), 
                title: `item of ${shop.title}`, 
                description: 'blah blah blah', 
                shop: shop._id, 
                city: city, createdAt: new Date(), 
                category: category, 
                price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] }

            Items.insert(item, { getAutoValues : false })
        }

    },
    generateCartItems(userId, count){

        this.setUserId(userId)

        for (var i = 0; i < count; i++) {
            var item = Items.findOne()
            Meteor.call('cart.addItem', item._id)
        };
    },
    createItemFromMyShop(userId){

        this.setUserId(userId)

        var itemId = Meteor.call('items.insert', {
            title: 'My item',
            description: 'It is mine',
            price: 30,
            category: 'deserts'
        })

        return Items.findOne(itemId)

    },
    generatePurchaseItems(userId, count){
        this.setUserId(userId)

        const deliveryInfo = {
            email: 'deliver@gmail.com',
            phone: '45454545',
            deliveryAddress: 'Address',
            deliveryDate: new Date(),
        }

        for (var i = 0; i < count; i++) {
            var item = Items.findOne()
            Purchases.insert({
                deliveryInfo,
                item: item._id,
                user: this.userId,
                shop: item.shop,
                status: 'accepted',
                createdAt: new Date(),
            })
        };

        Meteor.users.update(this.userId, { $inc: { 'profile.unreadPurchases': count }})
    }, 
    generateOrderItems(userId, count){

        this.setUserId(userId)

        const user = Meteor.users.findOne(userId)

        const deliveryInfo = {
            email: 'deliver@gmail.com',
            phone: '45454545',
            deliveryAddress: 'Address',
            deliveryDate: new Date(),
        }

        for (var i = 0; i < count; i++) {
            var item = Items.findOne()
            Purchases.insert({
                deliveryInfo,
                item: item._id,
                user: this.userId,
                shop: user.profile.shop,
                status: 'pending',
                createdAt: new Date()
            })
        };

        Shops.update(user.profile.shop, { $inc: { 'unreadOrders': count }})
    },          
    generateFixtures() {
        resetDatabase();

        const accounts = [
            { email: 'user@gmail.com', password: 'password', profile: {}},
            { email: 'user1@gmail.com', password: 'password', profile: {} },
            { email: 'user2@gmail.com', password: 'password', profile: {} },
            { email: 'user3@gmail.com', password: 'password', profile: {} },
            { email: 'user4@gmail.com', password: 'password', profile: {} },
        ]

        var accountsIds = accounts.map(function(account){
            var accountId = Accounts.createUser(account)
            return accountId
        })

        const shops = [
            { _id: Random.id(6), title: 'PizzaHot', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/kfc.jpg' },
            { _id: Random.id(6), title: 'CokkiesHot', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/kfc.jpg' },
            { _id: Random.id(6), title: 'MashaweeHot', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/kfc.jpg' },
            { _id: Random.id(6), title: 'Nabil Nafesseh Shop', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/kfc.jpg' },
            { _id: Random.id(6), title: 'McDonalds', description: 'blah blah blah', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/kfc.jpg' },
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
                { _id: Random.id(6), title: `An item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Random.id(6), title: `Another item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Random.id(6), title: `Wiered item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Random.id(6), title: `Popular item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Random.id(6), title: `Bad item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Random.id(6), title: `Excellent item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Random.id(6), title: `Not too bad item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Random.id(6), title: `Great item of ${shop.title}`, description: 'blah blah blah', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
            ]

            /*items.forEach(function(item){
                Items.insert(item, { getAutoValues : false })
            })*/

        })              

    },
});

let generateData;
if (Meteor.isClient) {
    // Create a second connection to the server to use to call test data methods
    // We do this so there's no contention w/ the currently tested user's connection
    const testConnection = Meteor.connect(Meteor.absoluteUrl());

    generateData = Promise.denodeify((cb) => {
        testConnection.call('generateFixtures', cb);
    });
}

export { generateData };