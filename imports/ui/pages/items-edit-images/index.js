import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'
import { Shops } from './../../../api/shops/collection'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsEditImagesPage.onCreated(function(){
	this.itemId = Router.current().params.itemId
	this.subscribe('singleItem', this.itemId)
})

Template.itemsEditImagesPage.helpers({
	item(){
		if (Template.instance().subscriptionsReady() && !Items.findOne(Router.current().params.itemId) ){
			Router.go('NotFound')
		}
		return Items.findOne(Router.current().params.itemId)
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
		return thumbnails
	}	
});

Template.itemsEditImagesPage.events({
	"click .back-btn"(event, instance){
		event.preventDefault()
		const itemId = Router.current().params.itemId
		const shop = Router.current().params.shop
		Router.go('items.edit', { shop: shop, itemId: itemId })
	}	
})

Template.itemThumbnailControl.events({
	'click .remove-thumbnail-btn'(event, instance){
		const itemId = Router.current().params.itemId
		const imageId = instance.data.imageId
		const item = Items.findOne(itemId)

		if (item.thumbnails.length > 1){
            if (confirm(TAPi18n.__('deleteItemImageConfirmation')) == true) {
				Meteor.call('items.removeThumbnail', itemId, imageId)           	
            }

		} else {
			alert(TAPi18n.__('itemShouldHaveAtLeastOneThumbnail'))
		}
	},
	'click .thumbnail-order-up-btn'(event, instance){
		const itemId = Router.current().params.itemId
		const imageId = instance.data.imageId
		Meteor.call('items.thumbnailUp', itemId, imageId)
	},
	'click .thumbnail-order-down-btn'(event, instance){
		const itemId = Router.current().params.itemId
		const imageId = instance.data.imageId
		Meteor.call('items.thumbnailDown', itemId, imageId)
	}		
});