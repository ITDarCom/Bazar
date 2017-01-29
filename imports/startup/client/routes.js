import {Router} from 'meteor/iron:router'
import { AccountsTemplates } from 'meteor/useraccounts:core';

SimpleSchema.debug = true
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

AccountsTemplates.configure({
    defaultLayout: 'ApplicationLayout'
});

AccountsTemplates.configureRoute('signIn', {
    name: 'accounts.signin',
    path: '/login',
    template: 'login',
    layoutTemplate: 'ApplicationLayout',
    redirect: '/'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'accounts.signup',
    path: '/signup',
    template: 'signup',
    layoutTemplate: 'ApplicationLayout',
    redirect: '/'
});

AccountsTemplates.configureRoute('changePwd', {
    name: 'accounts.changePwd',
    path: '/settings/change-password',
    template: 'changePwd',
    layoutTemplate: 'ApplicationLayout',
    redirect: 'settings.account'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'accounts.forgotPwd',
    path: '/settings/forgot-password',
    template: 'forgotPwd',
    layoutTemplate: 'ApplicationLayout',
    redirect: '/'
});

AccountsTemplates.configureRoute('resetPwd', {
    name: 'accounts.resetPwd',
    template: 'resetPwd',
    layoutTemplate: 'ApplicationLayout',
    redirect: '/'
});


Router.route('/logout', {
    name: 'logout',
    onBeforeAction: function () {
        //we only redirect to 'home' after we fully logged out using 'onLogoutHook'

        AccountsTemplates.logout(function () {
            Router.go('home');
        });
        this.render('appLoading')
    }

});


Router.onBeforeAction(function () {
    //top-level app subscriptions that we need to wait

    $('.snackbar').each(function(){
        $(this).snackbar('hide')
    })      

    this.wait(Meteor.subscribe('cart'))
    this.wait(Meteor.subscribe('categories'))
    this.wait(Meteor.subscribe('cities'))
    this.wait(Meteor.subscribe('userData'))
    this.wait(Meteor.subscribe('shopData'))
    this.wait(Meteor.subscribe('adminData'))    

    if (this.ready()) {
        this.next()
    } else {
        this.render('appLoading')
    }

})

Router.ensureLoggedIn = function () {
    if (Meteor.loggingIn()) {
        //console.log('logging in..')
        this.render('appLoading')
    } else {
        //console.log('finished logging in process.')
        if (!Meteor.user()) {
            this.redirect('accounts.signin');
        } else {
            this.next();
        }
    }
};

Router.ensureNotBlocked =function () {
    if(Meteor.user()&&Meteor.user().blocked){
        this.render('blockWarningPage');
    } else {
        this.next()
    }

};

Router.ensureIsAdmin =function () {
    if(Meteor.user()&&(!Meteor.user().isAdmin)){
        this.redirect('home');
    } else {
        this.next()
    }
}

const privateRoutes = [

    'shops.new',
    'shops.mine',
    'items.new',
    'items.edit',
    'items.editImages',
    'favorites.index',
    'settings.account',
    'settings.purchases',
    'settings.shop',
    'settings.orders',
    'settings.rejectedOrders',
    'settings.sales',
    'messages.index',
    'messages.thread',
    'cart',
    'admin.categories',
    'admin.categories.edit',
    'admin.users'
];

const adminRoute = [
    'admin.categories',
    'admin.categories.edit',
    'admin.cities',
    'admin.users'
]

Router.onBeforeAction(Router.ensureLoggedIn, {only: privateRoutes});

Router.onBeforeAction(Router.ensureNotBlocked,{only: privateRoutes});

Router.onBeforeAction(Router.ensureIsAdmin,{only: adminRoute});


Router.route('/', function () {
        this.render('mainNav', {to: 'nav'});
        this.render('homePage');

}, {
    name: 'home'
});


//this is not the best solution for SEO
//https://github.com/iron-meteor/iron-router/issues/1055
Router.route('/not-found', function () {
    this.render('mainNav', {to: 'empty'});
    this.render('defaultPage');
}, {
    name: 'NotFound'
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
	this.render('empty', {to: 'nav'});
	this.render('shopsNewPage');		
    if (Meteor.user() && Meteor.user().hasShop){
		this.redirect('shops.mine');
    }
}, {
    name: 'shops.new'
});

Router.route('/shops/mine', function () {
	if (Meteor.user() && Meteor.user().hasShop){
		Router.go('shops.show', { shop: Meteor.user().shop })
	} else {
		this.redirect('shops.index')
	}
}, {
    name: 'shops.mine'
});

Router.route('/shops/:shop', function () {

    this.render('empty', {to: 'nav'});
    this.render('shopsShowPage');
}, {
    name: 'shops.show',
});

//items routes
Router.route('/shops/:shop/items/new', function () {

	if (Meteor.user() && 
		Meteor.user().hasShop &&
		Meteor.user().shop == this.params.shop){

        this.render('empty', {to: 'nav'});
        this.render('itemsNewPage');

    } else {
        this.redirect('shops.index');
    }
}, {
    name: 'items.new'
});

Router.route('/shops/:shop/items/:itemId', function () {
    this.render('empty', {to: 'nav'});
    this.render('itemsShowPage');
}, {
    name: 'items.show'
});

Router.route('/shops/:shop/items/:itemId/edit', function () {

	if (Meteor.user() && 
		Meteor.user().hasShop &&
		Meteor.user().shop == this.params.shop){

        this.render('empty', {to: 'nav'});
        this.render('itemsEditPage');

    } else {
        this.redirect('shops.index');
    }
}, {
    name: 'items.edit'
});

Router.route('/shops/:shop/items/:itemId/edit/images', function () {

    if (Meteor.user() && 
        Meteor.user().hasShop &&
        Meteor.user().shop == this.params.shop){

        this.render('empty', {to: 'nav'});
        this.render('itemsEditImagesPage');

    } else {
        this.redirect('shops.index');
    }
}, {
    name: 'items.editImages'
});

//settings

Router.route('/settings/account', function () {
    this.render('empty', {to: 'nav'});
    this.render('settingsAccountPage');
}, {
    name: 'settings.account'
});

Router.route('/settings/purchases', function () {
    this.render('empty', {to: 'nav'});
    this.render('settingsPurchasesPage');
}, {
    name: 'settings.purchases'
});

Router.route('/settings/shop', function () {
    this.render('empty', {to: 'nav'});
    this.render('settingsShopPage');
}, {
    name: 'settings.shop'
});

Router.route('/settings/orders', function () {
    this.render('empty', {to: 'nav'});
    this.render('settingsOrdersPage');
}, {
    name: 'settings.orders'
});

Router.route('/settings/rejectedOrders', function () {
    this.render('empty', {to: 'nav'});
    this.render('settingsOrdersRejectedPage');
}, {
    name: 'settings.rejectedOrders'
});

Router.route('/settings/sales', function () {
    this.render('empty', {to: 'nav'});
    this.render('settingsSalesPage');
}, {
    name: 'settings.sales'
});


//messages
Router.route('/inbox', function () {
	this.render('empty', {to: 'nav'});
	this.render('inboxPage');
}, {
	name: 'inbox'
});

Router.route('/inbox/:thread', function () {
	this.render('empty', {to: 'nav'});
	this.render('threadPage');
}, {
	name: 'inbox.thread'
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
    this.render('aboutPage');
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
Router.route('/admin/announcements', function () {
    this.render('adminNav', {to: 'nav'});
    this.render('announcementsPage');
}, {
    name: 'admin.announcements'
});

Router.route('/admin/categories', function () {
    this.render('adminNav', {to: 'nav'});
    this.render('adminCategoriesPage');
}, {
    name: 'admin.categories'
});

Router.route('/admin/categories/:categoryId', function () {
    this.render('adminNav', {to: 'nav'});
    this.render('adminCategoriesEditPage');
}, {
    name: 'admin.categories.edit'
});

Router.route('/admin/cities', function () {
    this.render('adminNav', {to: 'nav'});
    this.render('adminCitiesPage');
}, {
    name: 'admin.cities'
});

Router.route('/admin/users', function () {
    this.render('adminNav', {to: 'nav'});
    this.render('adminUsersPage');
}, {
    name: 'admin.users'
});
