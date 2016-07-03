import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Router} from 'meteor/iron:router'

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'
import './template.html'
import './style.css'

Template.itemThumbnail.helpers({
    shop(){    	
    	if (Template.instance().data)
        	return Shops.findOne(Template.instance().data.shop)   
    },
    defaultThumbnail(){
    	if (Template.instance().data)
    		return Template.instance().data.thumbnails[0].url
    },
    isSearch(){
    	return Template.instance().search
    },
    favorite(){
        if (Meteor.userId()) {
            return Meteor.users.findOne({_id: Meteor.userId(), favorites: {$in: [this._id]}});
        }
    },
    isHidden(){
        return Template.instance().data.isHidden
    }
})

Template.itemThumbnail.events({
    "click .favorite-btn": function (){
        if (Meteor.userId()) {
            Meteor.call("makeFavorite",this._id);
        }
    },
    "click .detete-item-btn": function () {
        if (confirm(TAPi18n.__('deleteItemConfirmation'))){
             Meteor.call("item.remove",this._id)
        }
    },
    "click .hide-item-btn": function () {
        var shop = Shops.findOne({user: Meteor.userId()})
        if (shop.isHidden && this.isHidden) {
            alert(TAPi18n.__('youCannothideItem'));
            return
        }
        var status = !this.isHidden
        Meteor.call("item.hide",this._id,status)
    },
    //"click .edit-item-btn": function () {
    //     console.log("i am in edit function")
    //    if (Meteor.user()){
    //        console.log(Meteor.user());
    //        console.log(this);
    //        debugger;
    //        Router.go('items.edit', {shop :this.shop, itemId: this._id})
    //    }
    //},

});
