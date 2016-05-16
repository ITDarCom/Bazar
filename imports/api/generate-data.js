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
    generateCartItems(userId, count){

        this.setUserId(userId)

        for (var i = 0; i < count; i++) {
            var item = Items.findOne()
            Meteor.call('cart.addItem', item._id)
        };
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
                item: item._id,
                user: this.userId,
                shop: item.shop,
                status: 'accepted',
                createdAt: new Date()
            })
        };

        Meteor.users.update(this.userId, { $inc: { 'profile.unreadPurchases': count }})
    },       
    generateFixtures() {
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