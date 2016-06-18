import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Shops } from './../../../api/shops/collection'

Template.settingsShopPage.helpers({
    shop(){
        return Shops.findOne(Meteor.user().profile.shop)
    }
})

Template.settingsShopPage.events({
    'click .delete-shop-btn': function () {
        if (confirm(TAPi18n.__('deleteShopConfirmation'))) {
            Meteor.call('shops.remove')
        }
    },
    'click .hide-shop-btn': function () {
        var profile = Meteor.user().profile;
        if (profile && profile.hasShop) {
            var shop = Shops.findOne({_id: profile.shop})
            if (shop) {
                var status = !shop.isHidden;
                Meteor.call('shops.hide', status);
            }
        }
    }
})