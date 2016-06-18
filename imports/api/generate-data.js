
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
import { Cities } from './cities/collection.js'


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
            
            const shop = opts.shop? opts.shop : Shops.findOne()
            const category = opts.category? opts.category : Categories.findOne().identifier
            const city = opts.city? opts.city : shop.city
            const title = opts.title? opts.title: `item ${i} of ${shop.title}`
            
            var item = { 
                _id: Math.floor((Math.random() * 10000) + 1000), 
                title: title, 
                description: 'blah blah blah', 
                shop: shop._id, 
                city: city, createdAt: new Date(), 
                category: category, 
                price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] }

            Items.insert(item, { getAutoValues : false })
        }

        return Items.find(opts).fetch()

    },
    generateShops(count, options){

        const opts = options || {}

        for (var i = 0; i < count; i++) {
            const accountId = Accounts.createUser({
                email: `${Random.id(6)}@gmail.com`, password: `password`
            })

            this.setUserId(accountId)

            const title = opts.title? opts.title : `KakoHot${i}`

            Meteor.call('shops.insert', {
                title: title , description: 'blah blah blah', city:'jeddah'
            });
            
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
            phone: '0505330609',
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
            phone: '0505330609',
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
            { username: 'username', email: 'user@gmail.com', password: 'password', profile: {}},
            { username: 'username1', email: 'user1@gmail.com', password: 'password', profile: {} },
            { username: 'username2', email: 'user2@gmail.com', password: 'password', profile: {} },
            { username: 'username3', email: 'user3@gmail.com', password: 'password', profile: {} },
            { username: 'username4', email: 'user4@gmail.com', password: 'password', profile: {} },
            { username: 'bazar', email: 'bazar@gmail.com', password: '123456', profile: {} },
            { username: 'Kasem', email: 'kasem@gmail.com', password: '123456', profile: {} },
        ]

        var accountsIds = accounts.map(function(account){
            var accountId = Accounts.createUser(account)
            Meteor.users.update({_id: accountId},{$set: {isAdmin: true}});
            return accountId
        })

        const shops = [
            { _id: Random.id(6).toString(), title: 'متجر أم فيصل', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/shop-logo.png' },
            { _id: Random.id(6).toString(), title: 'متجر أم فيصل', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/shop-logo.png' },
            { _id: Random.id(6).toString(), title: 'متجر أم فيصل', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/shop-logo.png' },
            { _id: Random.id(6).toString(), title: 'متجر أم فيصل', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/shop-logo.png' },
            { _id: Random.id(6).toString(), title: 'متجر أم فيصل', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: '/shop-logo.png' },
        ]

        const categories = [
            { identifier: 'deserts', label: 'حلويات' },
            { identifier: 'mashawee', label: 'مشاوي' },
            { identifier: 'pateseries', label: 'معجنات' }
        ]

        categories.forEach(function(category){
            Categories.insert(category)
        })

        const cities = [
            { identifier: 'jeddah', label:'جدة' },
            { identifier: 'mecca', label: 'مكة' },
            { identifier: 'Al-riyad', label: 'الرياض' }
        ]

        cities.forEach(function(city){
            Cities.insert(city)
        })

        shops.forEach(function(shop, index){
            shop.user = accountsIds[index]
            var shopId = Shops.insert(shop, { getAutoValues : false })

            Meteor.users.update({ _id: accountsIds[index]}, 
                { $set: { 'profile.hasShop': true, 'profile.shop': shopId } 
            })  

            const items = [
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: [ {url:'/cookie.jpg'}, {url:'/cookie.jpg'}, {url:'/cookie.jpg'} ] },
            ]

            items.forEach(function(item){
                Items.insert(item, { getAutoValues : false })
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