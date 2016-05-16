import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

Template.applicationLayout.onCreated(function(){
})

Template.registerHelper('hasShop', function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.hasShop;
})

Template.registerHelper('unreadPurchases', function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.unreadPurchases;
})
