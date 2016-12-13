import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Items } from './../../../api/items/collection'
import { Purchases } from './../../../api/purchases/collection'
import { Shops } from './../../../api/shops/collection'
import { Images } from './../../../api/images'

import './template.html'

import {itemsCache} from './../../components/endless-list/cache.js'

Template.itemsShowPage.onCreated(function(){

	this.ready = new ReactiveVar(false)

	this.itemId = Router.current().params.itemId

	this.autorun(()=>{
		var subscription = itemsCache.subscribe('singleItem', this.itemId)

	    if (subscription.ready()){
	    	this.ready.set(subscription.ready())
	    }
	})
})

Template.itemsShowPage.helpers({
	admin(){
		return Meteor.users.findOne({isAdmin:true})
	},
	ready(){
		return Template.instance().ready.get()
	},
	item(){
		const item = Items.findOne(Template.instance().itemId)
		if (!item){
			Router.go('home'); return;			
		}
		//if this item is hidden and does not belong to the current user, redirect to home
		if (item.isHidden){
			if (!Meteor.user() || Meteor.user().shop != item.shop){
				Router.go('home')				
			}
		}
		return Items.findOne(Template.instance().itemId)
	},
	shop(){
		const item = Items.findOne(Template.instance().itemId)
		if (item){
			return Shops.findOne(item.shop)			
		}
	},
	lastShoppingContext(){
		return Session.get('lastShoppingContext')
	},
	isRemoved(){
		return Items.findOne(Template.instance().itemId).isRemoved		

	}	
})

Template.itemsShowPage.events({
	'click .back-btn'(event, instance){
		event.preventDefault()
		//Session.set('elementToScrollBack', null)
		if (!Session.get('lastShoppingContext')){
			const shop = Router.current().params.shop
			Router.go('shops.show', { shop: shop })
		} else {
			Router.go(Session.get('lastShoppingContext'))			
		}		
	},	
	'click .add-to-cart-btn': function(event, instance){
		if (!Meteor.user()){
			Router.go('accounts.signin')
		} else {

			var previous = Purchases.findOne({ 
				status: 'cart', 
				user: Meteor.userId(), 
				item: instance.itemId })

			if (previous){			

				var snack = $.snackbar({
					content: TAPi18n.__('itemAlreadyInCart'), 
					timeout: 0
				})
				$(snack).find('.snackbar-content').append("<span style='float:left;'><i class=\"material-icons\">close</i></span>")

			} else {				
				Meteor.call('cart.addItem', instance.itemId, function(err, data){
					var snack
					if (err){
						snack = $.snackbar({content: TAPi18n.__('somethingWrong'), timeout: 0});
					} else {
						snack = $.snackbar({
							content: TAPi18n.__('itemAddedToCartSuccessfully'),
							timeout: 0
						})
					}
					$(snack).find('.snackbar-content').append("<span style='float:left;'><i class=\"material-icons\">close</i></span>")

				})
			}
		}
	}
})

Template.itemCarousel.onRendered(function(){
	$('.item-carousel').slick({
		dots: true,
		infinite: false,
		speed: 300,
		rtl: true, 
		arrows: false,
		adaptiveHeight: false,
	});
})

Template.itemCarousel.helpers({

	singleThumb(){
        const item = Items.findOne(Router.current().params.itemId)

		if (item.thumbnails.length == 1){
			return true
		} else {
			return false
		}
	},

    orderedThumbnails(){
        const item = Items.findOne(Router.current().params.itemId)

        var thumbnails = item.thumbnails.concat()
        thumbnails.sort(function(a, b){
            if (a.order < b.order){
                return -1
            } else if (a.order > b.order){
                return 1
            } else return 0
        })

        return thumbnails.map(function(thumb){
        	return Images.findOne(thumb.imageId)
        })
    },
    isEdit(){
    	const route = Router.current().route.getName()
    	if (route.match(/edit/)){ return true; } else { return false; }
    },
    favorite(){
        if (Meteor.userId()) {
            return Meteor.users.findOne({_id: Meteor.userId(), favorites: {$in: [this._id]}});
        }
    },       	
})

Template.itemCarousel.events({
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
          message: 'تفقد هذا المنتج على بازار!', // not supported on some apps (Facebook, Instagram)
          subject: 'تفقد هذا المنتج على بازار!', // fi. for email
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
})