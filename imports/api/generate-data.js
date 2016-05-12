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
            { title: 'PizzaHot', description: 'blah blah blah', city: 'jeddah' },
            { title: 'CokkiesHot', description: 'blah blah blah', city: 'jeddah' },
            { title: 'MashaweeHot', description: 'blah blah blah', city: 'jeddah' },
            { title: 'Nabil Nafesseh Shop', description: 'blah blah blah', city: 'jeddah' },
            { title: 'McDonalds', description: 'blah blah blah', city: 'jeddah' },
        ]

        const categories = [
            { identifier: 'deserts', label: 'حلويات' },
            { identifier: 'mashawee', label: 'مشاوي' },
            { identifier: 'pateseries', label: 'معجنات' }
        ]

        categories.forEach(function(category){
            Categories.insert(category)
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