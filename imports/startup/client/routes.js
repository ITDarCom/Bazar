import {Router} from 'meteor/iron:router'
import { AccountsTemplates } from 'meteor/useraccounts:core';

SimpleSchema.debug = true
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

AccountsTemplates.configure({
    defaultLayout: 'ApplicationLayout',
    onLogoutHook: function () {
	    if (Meteor.isClient) {
	        Router.go('home');
	    }
	}
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login',
    template: 'login',
    layoutTemplate: 'ApplicationLayout',
    redirect: '/'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signup',
    path: '/signup',
    template: 'signup',
    layoutTemplate: 'ApplicationLayout',
    redirect: '/'
});

Router.route('/logout', {
    name: 'logout',
    onBeforeAction: function () {
        //we only redirect to 'home' after we fully logged out using 'onLogoutHook'
        AccountsTemplates.logout();
        //this.render('spinner')
    }
});

Router.onBeforeAction(function(){
	//top-level app subscriptions that we need to wait
	this.wait(Meteor.subscribe('cart'))
	this.wait(Meteor.subscribe('categories'))
	this.wait(Meteor.subscribe('userData'))
	this.wait(Meteor.subscribe('shopData'))

	if (this.ready()){
		this.next()
	} else {
		this.render('appLoading')
	}
})

Router.route('/', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('homePage');
}, {
	name: 'home'
});

// favorite route
Router.route('/favorites', function () {
	this.render('favoritesShowPage');
}, {
	name: 'favorites.index'
});


//category routes
Router.route('/categories/:category', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('categoriesShowPage');
}, {
	name: 'categories.show'
});

//shops routes
Router.route('/shops', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('shopsIndexPage');
}, {
	name: 'shops.index'
});

Router.route('/shops/new', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('shopsNewPage');
}, {
	name: 'shops.new'
});

Router.route('/shops/mine', function () {
	if (Meteor.user() && Meteor.user().profile.hasShop){
		Router.go('shops.show', { shop: Meteor.user().profile.shop })
	} else {
		this.redirect('shops.index')
	}
}, {
	name: 'shops.mine'
});

Router.route('/shops/:shop', function () {
	this.render('mainNav', {to: 'empty'});
	this.render('shopsShowPage');
}, {
	name: 'shops.show'
});

//items routes
Router.route('/shops/:shop/items/new', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('itemsNewPage');
}, {
	name: 'items.new'
});

Router.route('/shops/:shop/items/:itemId', function () {
	this.render('mainNav', {to: 'empty'});
	this.render('itemsShowPage');
}, {
	name: 'items.show'
});

Router.route('/shops/:shop/items/:itemId/edit', function () {
	this.render('mainNav', {to: 'nav'});
	this.render('itemsEditPage');
}, {
	name: 'items.edit'
});

//settings

Router.route('/settings/account', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('defaultPage');
}, {
	name: 'settings.account'
});

Router.route('/settings/purchases', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('settingsPurchasesPage');
}, {
	name: 'settings.purchases'
});

Router.route('/settings/shop', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('settingsShopPage');
}, {
	name: 'settings.shop'
});

Router.route('/settings/orders', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('settingsOrdersPage');
}, {
	name: 'settings.orders'
});

Router.route('/settings/sales', function () {
	this.render('settingsNav', {to: 'nav'});
	this.render('settingsSalesPage');
}, {
	name: 'settings.sales'
});


//messages
Router.route('/messages', function () {
	this.render('empty', {to: 'nav'});
	this.render('defaultPage');
}, {
	name: 'messages.index'
});

Router.route('/messages/:thread', function () {
	this.render('empty', {to: 'nav'});
	this.render('defaultPage');
}, {
	name: 'messages.thread'
});

//cart
Router.route('/cart', function () {
	this.render('empty', {to: 'nav'});	
	this.render('cartPage');
}, {
	name: 'cart'
});

Router.route('/about', function () {
	this.render('empty', {to: 'nav'});
	this.render('defaultPage');
}, {
	name: 'about'
});

Router.route('/contact', function () {
	this.render('empty', {to: 'nav'});
	this.render('defaultPage');
}, {
	name: 'contact'
});


//admin routes

Router.route('/admin/categories', function () {
	this.render('adminNav', {to: 'nav'});
	this.render('adminCategoriesPage');
}, {
	name: 'admin.categories'
});


Router.route('/admin/users', function () {
	this.render('adminNav', {to: 'nav'});
	this.render('adminUsersPage');
}, {
	name: 'admin.users'
});
