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
    this.shopLogo = document.createElement('img');
    this.image.onload = function () {
        instance.loaded.set(true)
    };

    const thumb = Template.instance().data.thumbnails.find(thumb => (thumb.order == 1))
    if(thumb){
        this.image.src = Meteor.absoluteUrl().replace(/\/$/,"") + thumb.url
    }else{
        this.image.src ='/default-thumbnail.png';
    }
    this.autorun(()=>{
        const shop = Shops.findOne(Template.instance().data.shop) 
        if (shop) this.shopLogo.src = Meteor.absoluteUrl().replace(/\/$/,"") + shop.logo.url         
    })

})

Template.itemThumbnail.helpers({
    identifier(){
        return `item-${Template.instance().data._id}`
    },
    shop(){    	
    	return Shops.findOne(Template.instance().data.shop)   
    },
    backgroundImage(){
        const thumb = Template.instance().data.thumbnails.find(thumb => (thumb.order == 1))
        if (!Template.instance().loaded.get()){
            return '/ajax-loader.gif'
        } else {
             if(thumb){
                     return (Meteor.absoluteUrl().replace(/\/$/,"") + thumb.url) 
                }else{
                    return '/default-thumbnail.png';
                }
                      
        }
    },
    shopLogoAbsolute(){
        const shop = Shops.findOne(Template.instance().data.shop) 

        if (shop) return Meteor.absoluteUrl().replace(/\/$/,"") + shop.logo.url
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
    shopLogobackgroundSize(){
        const instance = Template.instance()
        if (!instance.loaded.get()){
            return "auto auto"
        } else if (instance.shopLogo.width > instance.shopLogo.height) {            
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
    "click .share-btn": function(event){

        event.preventDefault();
        
        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        var options = {
          message: 'تفقد هذا المنتج على بازار الالكتروني!', // not supported on some apps (Facebook, Instagram)
          subject: 'تفقد هذا المنتج على بازار الالكتروني!', // fi. for email
          files: ['', ''], // an array of filenames either locally or remotely
          url: Meteor.absoluteUrl().replace(/\/$/,"") + Router.path('items.show', {
            shop: Template.instance().data.shop,
            itemId: Template.instance().data._id,
          }),
          chooserTitle: 'اختر تطبيقا' // Android only, you can override the default share sheet title
        }

        var onSuccess = function(result) {
          console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
          console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        }

        var onError = function(msg) {
          console.log("Sharing failed with message: " + msg);
        }

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

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

