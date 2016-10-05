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
	ready(){
		return Template.instance().ready.get()
	},
	item(){
		const item = Items.findOne(Template.instance().itemId)
		if (!item){
			Router.go('NotFound'); return;			
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
	}	
})

Template.itemsShowPage.events({
	'click .back-btn'(event, instance){
		event.preventDefault()
		Session.set('elementToScrollBack', null)
		Router.go(Session.get('lastShoppingContext'))
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
    }
})