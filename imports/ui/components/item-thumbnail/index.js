import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Router} from 'meteor/iron:router'

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'
import './template.html'
import './style.css'
Template.itemThumbnail.helpers({
    identifier(){
        return `item-${Template.instance().data._id}`
    },
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
    "click .favorite-btn": function (event) {
        var star = event.target;
        var favoriteStatus;
        if (($(star).attr("class") == "fa fa-star-o")) {
            favoriteStatus = true;
        } else {
            favoriteStatus = false;
        }

        if (Meteor.userId()) {
            Meteor.call("item.favoriteIt", this._id, favoriteStatus);
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
    }

});

