import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Items } from './../../api/items/collection.js'
import { Shops } from './../../api/shops/collection.js'
import { Purchases } from './../../api/purchases/collection.js'
import { Categories } from './../../api/categories/collection.js'
import { Threads } from './../../api/threads/collection.js'

import { resetDatabase } from 'meteor/xolvio:cleaner';
import {TAPi18n} from "meteor/tap:i18n";


SimpleSchema.debug = true

import './../../api/shops/methods.js'
import './../../api/items/methods.js'
import './../../api/purchases/methods.js'
import './../../api/users/methods.js'
import './../../api/threads/methods.js'

import './../../api/users/publications.js'
import './../../api/users/methods.js'
import './../../api/categories/publications.js'
import './../../api/items/publications.js'
import './../../api/shops/publications.js'
import './../../api/purchases/publications.js'
import './../../api/threads/publications.js'

import './../../api/generate-data.js'

Meteor.startup(() => {
	//Meteor.call('generateFixtures')
});
