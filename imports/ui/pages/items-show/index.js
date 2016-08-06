import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Items } from './../../../api/items/collection'
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
	}
})

Template.itemsShowPage.events({
	'click .add-to-cart-btn': function(event, instance){

		Meteor.call('cart.addItem', instance.itemId)
		Router.go('cart')

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
    }   	
})