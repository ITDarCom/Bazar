
import { Meteor } from 'meteor/meteor';
//import { Factory } from 'meteor/factory';
//import { resetDatabase } from 'meteor/xolvio:cleaner';
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
import { Threads } from './threads/collection.js'
import { Cities } from './cities/collection.js'

const defaultThumbnails = [ 
    {url:'/cookie.jpg', imageId: '1', order: 1}, 
    {url:'/cookie-2.png', imageId: '2', order: 2}, 
    {url:'/cookie-3.png', imageId: '3', order: 3} 
];

const defaultImageIds = [ '1', '2', '3'];

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
    generateUser(userOptions){
        const userId = Accounts.createUser(userOptions)
        return Meteor.users.findOne(userId)
    },
    createUserWithShop(userOptions, shopOptions){
        const userId = Accounts.createUser(userOptions)
        this.setUserId(userId)
        Meteor.call('shops.insert', shopOptions)        
        return Meteor.users.findOne(userId)
    }, 
    getShop(shopTitle){
        return Shops.findOne({title: shopTitle})
    },
    generateItems(count, options){

        const opts = options || {}

        if (opts.mine && Meteor.user()){
            opts.shop = Shops.findOne(Meteor.user().shop)
        }

        for (var i = 0; i < count; i++) {
            
            const shop = opts.shop? opts.shop : Shops.findOne()
            const category = opts.category? opts.category : Categories.findOne().identifier
            const city = opts.city? opts.city : shop.city
            const title = opts.title? opts.title: `كوكيز نرويجي`
            
            var item = { 
                _id: Math.floor((Math.random() * 10000) + 1000), 
                title: title, 
                description: 'blah blah blah', 
                shop: shop._id, 
                city: city, createdAt: new Date(), 
                category: category, 
                price: 50, 
                isHidden: false,
                thumbnails: defaultThumbnails }

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
    generatePurchaseItems(userId, count, options){

        const opts = options || {}

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
                status: opts.status? opts.status : 'accepted',
                createdAt: new Date(),
            })
        };

        if (opts.status && opts.status == 'pending'){
            Meteor.users.update(this.userId, { $inc: { 'pendingPurchases': count }})
        } else {
            Meteor.users.update(this.userId, { $inc: { 'unreadPurchases': count }})
        }

    }, 
    generateOrderItems(userId, count, fromUser){

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
                user: fromUser || this.userId,
                shop: user.shop,
                status: 'pending',
                createdAt: new Date()
            })
        };

        Shops.update(user.shop, { $inc: { 'unreadOrders': count }})
    },
    getThread(threadId){
        return Threads.findOne(threadId)
    },
    getOriginalUser(participant){
        if (participant.type == 'user'){
            return Meteor.users.findOne(participant.id)
        } else if (participant.type == 'shop') {
            return Meteor.users.findOne({'shop':participant.id})
        }
    },
    generateThreads(userId, count, options){

        const opts = options || {}

        var currentUser = Meteor.users.findOne(userId)

        var shopId = null
        if (opts.inbox.match(/shop/)){
            shopId = currentUser.shop
        }

        const unread = opts.unread || false

        for (var i = 0; i < count; i++) {

            var otherAccount = Meteor.users.findOne({ _id: { $ne: userId }})
            var otherShop = Shops.findOne({ _id: { $ne: shopId }})

            if (!otherShop || !otherAccount){
                 throw new Error('generateData: there should be existing shops or accounts');
            }

            var messageFromAnotherUser = {
                author : {
                    type: 'user', id: otherAccount._id
                },
                body: 'Hello', createdAt: new Date()
            }

            var messageFromAnotherShop = {
                author : {
                    type: 'shop', id: otherShop._id
                },
                body: 'Hello', createdAt: new Date()
            }            

            var messageFromMyAccount = {
                author : {
                    type: 'user', id: userId
                },
                body: 'Hi', createdAt: new Date()
            }

            var messageFromMyShop = {
                author : {
                    type: 'shop', id: shopId
                },
                body: 'Hi', createdAt: new Date()
            }

            var messages, participants = []

            if (opts.inbox.match(/personal/)){
                messages = [messageFromAnotherShop, messageFromMyAccount]
            } else {
                messages = [messageFromAnotherUser, messageFromMyShop]
            }

            //console.log(Object.assign(messages[0].author, { unread: false }))
            
            var thread = { 
                messages: messages, 
                participants: [
                    _.extend(_.clone(messages[0].author), { unread: false }), 
                    _.extend(_.clone(messages[1].author), { unread: unread })
                ],
                updatedAt: new Date(),
            }

            Threads.insert(thread)
        }

        if (unread){
            Meteor.users.update(userId, { $inc: { 'unreadInbox': count }})
        }

    },             
    generateFixtures() {
        
        //resetDatabase();        

        const accounts = [
            { username: 'username', email: 'user@gmail.com', password: 'password'},
            { username: 'username1', email: 'user1@gmail.com', password: 'password' },
            { username: 'username2', email: 'user2@gmail.com', password: 'password' },
            { username: 'username3', email: 'user3@gmail.com', password: 'password' },
            { username: 'username4', email: 'user4@gmail.com', password: 'password' },
            { username: 'username5', email: 'user5@gmail.com', password: 'password' },
            { username: 'username6', email: 'user6@gmail.com', password: 'password' },
            { username: 'username7', email: 'user7@gmail.com', password: 'password' },
            { username: 'username8', email: 'user8@gmail.com', password: 'password'},
            { username: 'username9', email: 'user9@gmail.com', password: 'password'},
            { username: 'username10', email: 'user10@gmail.com', password: 'password'},
            { username: 'username11', email: 'user11@gmail.com', password: 'password'},
            { username: 'username12', email: 'user12@gmail.com', password: 'password'},
            { username: 'username13', email: 'user13@gmail.com', password: 'password'},
            { username: 'username14', email: 'user14@gmail.com', password: 'password'},
            { username: 'username15', email: 'user15@gmail.com', password: 'password'},
            { username: 'bazar', email: 'bazar@gmail.com', password: '123456' }
        ];
        
        var accountsIds = accounts.map(function(account){
            var accountId = Accounts.createUser(account)
            return accountId
        });

        Meteor.users.update({username: 'bazar'},{$set: {isAdmin: true}});

        const shops = [
            { _id: Random.id(6).toString(), title: 'متجر أم فيصل', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر أم أحمد', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر أم تحسين', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر أم طلال', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر أم باسم', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر أم ياسر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر أم ياسر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر أم محمد', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء آخر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء آخر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء آخر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء آخر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء آخر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء آخر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false },
            { _id: Random.id(6).toString(), title: 'متجر ياء آخر', description: 'أفضل أنواع الحلويات تستحق التجربة الآن متوفرة بكميات كبيرة', city: 'jeddah', user:'tmp', createdAt: new Date(), unreadOrders: 0, logo: {url:'/shop-logo.png', imageId:'dummyId'}, isHidden: false }
        ];

        const categories = [
            { identifier: 'deserts', label: 'حلويات',order: 1 },
            { identifier: 'mashawee', label: 'مشاوي',order: 2 },
            { identifier: 'pateseries', label: 'معجنات',order:3 }
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
            while (Shops.findOne(shop._id)){
                shop._id = Random.id(6).toString()
            }
            var shopId = Shops.insert(shop, { getAutoValues : false })

            Meteor.users.update({ _id: accountsIds[index]}, 
                { $set: { 'hasShop': true, 'shop': shopId } 
            })  

            const items = [
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
                { _id: Math.floor((Math.random() * 10000) + 1000).toString(), title: `كوكيز نرويجي`, description: 'أفاق واحدة الثقيلة. دنو أم أواخر وبريطانيا. مدن ان خلاف النفط إتفاقية, لغزو عالمية لم انه. لها إذ عُقر وصغار الدولارات, دار بل السيء الربيع', shop: shopId, city: 'jeddah', createdAt: new Date(), category: 'mashawee', price: 50, thumbnails: defaultThumbnails, imageIds:defaultImageIds, isHidden:false },
            ]

            if (Items.find().count() == 0){
                items.forEach(function(item){
                    while (Items.findOne(item._id)){
                        item._id = Math.floor((Math.random() * 10000) + 1000).toString()
                    }
                    Items.insert(item, { getAutoValues : false })
                });
            }

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