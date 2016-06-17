import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Items } from './../../api/items/collection.js'
import { Shops } from './../../api/shops/collection.js'
import { Purchases } from './../../api/purchases/collection.js'
import { Categories } from './../../api/categories/collection.js'

import { resetDatabase } from 'meteor/xolvio:cleaner';
import {TAPi18n} from "meteor/tap:i18n";


SimpleSchema.debug = true

import './../../api/shops/methods.js'
import './../../api/items/methods.js'
import './../../api/purchases/methods.js'
import './../../api/users/methods.js'

import './../../api/users/publications.js'
import './../../api/users/methods.js'
import './../../api/categories/publications.js'
import './../../api/categories/methods.js'
import './../../api/cities/publications.js'
import './../../api/cities/methods.js'

import './../../api/items/publications.js'
import './../../api/shops/publications.js'
import './../../api/purchases/publications.js'

import './../../api/generate-data.js'

import './../../ui/pages/admin-users/users-table.js'
import './../../api/accounts-base/accounts-server.js'

Meteor.startup(() => {
	Meteor.call('generateFixtures')
});
