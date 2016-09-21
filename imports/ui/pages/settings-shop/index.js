import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Shops } from './../../../api/shops/collection'

Template.settingsShopPage.helpers({
	shop(){
		return Shops.findOne(Meteor.user().shop)
	}
})

Template.settingsShopPage.events({
    'click .delete-shop-btn': function (e) {
        e.preventDefault()
        if (confirm(TAPi18n.__('deleteShopConfirmation'))) {
            Meteor.call('shops.remove')
        }
    },
    'click .hide-shop-btn': function (e) {

        e.preventDefault()
        if (Meteor.user().hasShop) {
            var shop = Shops.findOne({_id: Meteor.user().shop})
            if (shop) {
                var status = !shop.isHidden;
                Meteor.call('shop.hide', status);
            }
        }
    }
})