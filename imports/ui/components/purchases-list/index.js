import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {GoogleMaps} from 'meteor/dburles:google-maps'

import {Router} from 'meteor/iron:router'

import { Purchases } from './../../../api/purchases/collection'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.purchasesList.onCreated(function(){

	this.channel = new ReactiveVar()

	//subscribing to the appropriate channel on server
	this.autorun(()=>{
		var route = Router.current().route.getName()
		var channel = route.match(/settings.(\w+)/)[1] //purchases, orders or sales
		this.subscribe(channel)
		this.channel.set(channel)
	})
})

Template.purchasesList.helpers({
	purchaseTemplate(){
		switch (Template.instance().channel.get()){
			case "purchases": return "purchaseItem";
			case "orders": return "orderItem";
			case "sales": return "saleItem";
			case "rejectedOrders": return "saleItem";
		}
	},
	purchases(){
		let selector = {}
		switch (Template.instance().channel.get()){
			case "purchases": 
				selector = { user: Meteor.userId(), status : { $ne : 'cart'}}
			break;
			case "orders": 
				selector = { 
					shop: Meteor.user().shop, 
					$or : [
						{status : 'pending'},
						{status : 'accepted'},
					]
				}
			break;
			case "sales": 
				selector = { 
					shop: Meteor.user().shop, 
					$or : [
						{ status : 'delivered' },
						/*{ status : 'rejected' },*/
					]					
				}
			break;
			case "rejectedOrders": 
				selector = { 
					shop: Meteor.user().shop, 
					$or : [
						/*{ status : 'delivered' },*/
						{ status : 'rejected' },
					]					
				}
			break;			
		}
		return Purchases.find(selector, { sort: { sentAt: -1 }})
	},
	currentChannel(){
		return Template.instance().channel.get()
	}
})

Template.orderItem.events ({
	'click .accept-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		if (confirm(TAPi18n.__('acceptOrderConfirmation'))){
			Meteor.call('orders.process', purchaseId, 'accepted')
		}
	},
	'click .reject-order-btn':function(event, instance){
		var purchaseId = instance.data._id
		if (confirm(TAPi18n.__('rejectOrderConfirmation'))){
			Meteor.call('orders.process', purchaseId, 'rejected')			
		}
	},
	'click .delivered-order-btn' : function (event, instance) {
		var purchaseId = instance.data._id;
		if (confirm(TAPi18n.__('deliverOrderConfirmation'))){
			Meteor.call('orders.process', purchaseId, 'delivered');
		}		
	},
    "click .location-share-btn": function(event, instance){

		const location = instance.data.deliveryInfo.location

		console.log("http://maps.google.com/maps?z=16&t=m&q=loc:"+location.lat+"+"+location.lng)

        event.preventDefault();
        
        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        var options = {
          message: "http://maps.google.com/maps?z=16&t=m&q=loc:"+location.lat+"+"+location.lng, // not supported on some apps (Facebook, Instagram)
          subject: 'موقع الطلبية', // fi. for email
          files: ['', ''], // an array of filenames either locally or remotely
          url: "http://maps.google.com/maps?z=16&t=m&q=loc:"+location.lat+"+"+location.lng,
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
});

function getItem(itemId){
	return Items.findOne(itemId)
}

Template.orderItem.helpers({
	item(){
		return getItem(Template.instance().data.item)
	},
	member(){
		return Meteor.users.findOne(Template.instance().data.user).username
	},
	total(){
		const data = Template.instance().data
		const item = getItem(data.item)
		if (item) return (item.price * data.quantity)
	},
	modalId(){
		const data = Template.instance().data		
		return `message-modal-${data._id}`
	},
	mapModalId(){
		const data = Template.instance().data		
		return `location-modal-${data._id}`
	},	
	accepted(){
		return (Template.instance().data.status == 'accepted')
	},
	hasLocation(){
		const data = Template.instance().data;
		if (data.deliveryInfo.location){
			return true
		} else {
			return false
		}
	}
})

Template.purchaseItem.helpers({
	item(){
		return getItem(Template.instance().data.item)
	},
	statusClass(){
		switch (Template.instance().data.status){
			case "pending": return "list-group-item-warning";
			case "accepted": return "list-group-item-info";
			case "rejected": return "list-group-item-danger";
			case "delivered": return "list-group-item-success";
		}		
	},
	total(){
		const data = Template.instance().data
		const item = getItem(data.item)
		if (item) return (item.price * data.quantity)
	},
	modalId(){
		const data = Template.instance().data		
		return `message-modal-${data._id}`
	},
	mapModalId(){
		const data = Template.instance().data		
		return `location-modal-${data._id}`
	},	
	hasLocation(){
		const data = Template.instance().data;
		if (data.deliveryInfo.location){
			return true
		} else {
			return false
		}
	}		
})

Template.saleItem.helpers({
	item(){
		return getItem(Template.instance().data.item)
	},
	delivered(){
		return (Template.instance().data.status == 'delivered')
	},
	member(){
		return Meteor.users.findOne(Template.instance().data.user).username
	},
	statusClass(){
		switch (Template.instance().data.status){
			case "pending": return "list-group-item-warning";
			case "accepted": return "list-group-item-info";
			case "rejected": return "list-group-item-danger";
			case "delivered": return "list-group-item-success";
		}		
	},	
	total(){
		const data = Template.instance().data
		const item = getItem(data.item)
		if (item) return (item.price * data.quantity)
	},
	modalId(){
		const data = Template.instance().data		
		return `message-modal-${data._id}`
	},
	mapModalId(){
		const data = Template.instance().data		
		return `location-modal-${data._id}`
	},	
	hasLocation(){
		const data = Template.instance().data;
		if (data.deliveryInfo.location){
			return true
		} else {
			return false
		}
	}	
})


Template.locationModal.onRendered(function() {
	GoogleMaps.load({ key: 'AIzaSyBiCLkIztt-fy3DUVGE64sxAuwJ2Mbe1iM', v: '3'});

	var instance = this

	const mapSelector = `#${instance.data.modalId} .map-canvas`

	if (instance.data.location){

		$(`#${instance.data.modalId}`).on("shown.bs.modal", function () {
			const map = $(mapSelector).get(0)
			const location = instance.data.location
		    window.google.maps.event.trigger(map, "resize");

			GoogleMaps.ready(instance.data.modalId, function(map) {
	    		map.instance.setCenter({lat: location.lat, lng: location.lng })

				var marker = new window.google.maps.Marker({
				  position: new window.google.maps.LatLng(location.lat, location.lng),
				  map: map.instance
				});    		
			})
		});	
		
	}

});

Template.locationModal.helpers({
	modalId(){		
		return Template.instance().data.modalId
	},	
	mapOptions(){		
		if (GoogleMaps.loaded() && Template.instance().data.location) {
			const location = Template.instance().data.location
			return {
				center: new window.google.maps.LatLng(location.lat, location.lng),
			    zoom: 16			
			}			
		}		
	}	
})