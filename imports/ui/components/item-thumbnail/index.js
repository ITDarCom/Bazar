import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Router} from 'meteor/iron:router'

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'

import './template.html'
import './style.css'

Template.itemThumbnail.onCreated(function(){
    
    this.loaded = new ReactiveVar(false)

    var instance = this
    this.image = document.createElement('img');
    this.image.onload = function () {
        instance.loaded.set(true)
    };

    const thumb = Template.instance().data.thumbnails.find(thumb => (thumb.order == 1))
    this.image.src = thumb.url
})

Template.itemThumbnail.helpers({
    identifier(){
        return `item-${Template.instance().data._id}`
    },
    shop(){    	
    	if (Template.instance().data)
        	return Shops.findOne(Template.instance().data.shop)   
    },
    backgroundImage(){
        if (!Template.instance().loaded.get()){
            return '/ajax-loader.gif'
        } else {            
            const thumb = Template.instance().data.thumbnails.find(thumb => (thumb.order == 1))
            if (thumb) return thumb.url
        }
    },
    backgroundSize(){
        const instance = Template.instance()
        if (!instance.loaded.get()){
            return "auto auto"
        } else if (instance.image.width > instance.image.height) {            
            return "auto 100%"
        } else {
            return "100% auto"
        }
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
    },
    isRemoved(){
        console.log(Template.instance().data.isRemoved)
        return Template.instance().data.isRemoved
    },
    thumbnailDark(){
      return Template.instance().data.isRemoved || Template.instance().data.isHidden
    }      
})

Template.itemThumbnail.events({
    "click .favorite-btn": function (event) {

        var favoriteStatus;
        
        if (Meteor.user()) {
            const itemId = Template.instance().data._id
            if (Meteor.user().favorites && 
                (Meteor.user().favorites.indexOf(itemId) != -1)){
                favoriteStatus = false;                  
            } else {
                favoriteStatus = true;
            }
            Meteor.call("item.favoriteIt", itemId, favoriteStatus);
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

