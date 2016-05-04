import {Router} from 'meteor/iron:router'

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('home');
}, {
	name: 'home'
});

//category routes
Router.route('/categories/:category', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('categories.show');
}, {
	name: 'categories.show'
});

//shops routes
Router.route('/shops', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('shopsIndex');
}, {
	name: 'shops.index'
});

Router.route('/shops/:shop', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('default');
}, {
	name: 'shops.show'
});

Router.route('/shops/new', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('default');
}, {
	name: 'shops.new'
});

//items routes
Router.route('/shops/:shop/items/new', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('default');
}, {
	name: 'items.new'
});

Router.route('/shops/:shop/items/:itemId', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('default');
}, {
	name: 'items.show'
});

Router.route('/shops/:shop/items/:itemId/edit', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('default');
}, {
	name: 'items.edit'
});

//settings

Router.route('/settings/account', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('default');
}, {
	name: 'settings.account'
});

Router.route('/settings/purchases', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('settingsPurchases');
}, {
	name: 'settings.purchases'
});

Router.route('/settings/store', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('default');
}, {
	name: 'settings.store'
});

Router.route('/settings/orders', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('settingsOrders');
}, {
	name: 'settings.orders'
});

Router.route('/settings/sales', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('settingsSales');
}, {
	name: 'settings.sales'
});


//messages
Router.route('/messages', function () {
	this.render('empty', {to: 'nav'});
	this.render('default');
}, {
	name: 'messages.index'
});

Router.route('/messages/:thread', function () {
	this.render('empty', {to: 'nav'});
	this.render('default');
}, {
	name: 'messages.thread'
});

//cart
Router.route('/cart', function () {
	this.render('empty', {to: 'nav'});	
	this.render('cart');
}, {
	name: 'cart'
});

Router.route('/about', function () {
	this.render('empty', {to: 'nav'});
	this.render('default');
}, {
	name: 'about'
});

Router.route('/contact', function () {
	this.render('empty', {to: 'nav'});
	this.render('default');
}, {
	name: 'contact'
});