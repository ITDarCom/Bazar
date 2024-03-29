
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {GoogleMaps} from 'meteor/dburles:google-maps'

import { Router } from 'meteor/iron:router';
import { Purchases } from './../../../api/purchases/collection'
import { Items } from './../../../api/items/collection'

import './template.html'

Template.cartPage.onCreated(function(){
	this.showDeliveryForm = new ReactiveVar(false);
	GoogleMaps.load({ key: 'AIzaSyBiCLkIztt-fy3DUVGE64sxAuwJ2Mbe1iM', v: '3' });	
});

AutoForm.addHooks('deliveryInformationForm', {
    onError : function(){

        if (this.validationContext._invalidKeys.find(key => key.name.match(/location/) )){
            $('.location-on-map .form-group').addClass('is-focused')

            $('.location-on-map').click(function(){

            	$('.location-on-map .form-group').removeClass('is-focused')

            })
        }
    }
})

Template.cartPage.helpers({
	empty(){
		return (Purchases.find().count() == 0)
	},
	purchases(){
		return Purchases.find({ status: 'cart' })
	},
	showDeliveryForm(){
		return Template.instance().showDeliveryForm.get()
	}
})

Template.cartPage.events({
	'click .submit-cart-btn': function (event, instance){
		instance.showDeliveryForm.set(true);	
	},
	'click .back-btn'(event, instance){
		event.preventDefault()
		window.history.back()
	}
});

Template.cartItemForm.onCreated(function(){

	const purchaseId = Template.instance().data._id
	this.formId = `cartItemForm-${purchaseId}`
	var hooks = {}
	hooks[this.formId] = {
		/*beginSubmit: function() {
			console.log('begin')
		},
		endSubmit: function() {
			console.log('end')
		}*/
	}
	AutoForm.hooks(hooks)
})

Template.cartItemForm.helpers({
	formCollection(){
		return Purchases;
	},
	autoSaveMode(){
		return true
	},
	quantities() {
		var values = [];
		for (var i = 1; i <= 100; i++) { values.push(i); }
		return values.map(function(value){
			return {label:value, value:value}
		})
	},	
	//we need to assign a unique formId for each autoform. 
	//check this github issue: https://github.com/aldeed/meteor-autoform/issues/298
	cartItemFormId(){
		return Template.instance().formId
	},
	notesPlaceholder(){
		return TAPi18n.__('writeNotestoShop')
	}
})

Template.cartItem.helpers({
	item(){
		return Items.findOne(Template.instance().data.item)
	}
});

Template.cartItemForm.events({
	'click .remove-cart-item-btn': function (event, instance){
        if (confirm(TAPi18n.__('deleteItemConfirmation')) == true) {
			Meteor.call('cart.removePurchase', instance.data._id)
        }		
	}
});

Template.deliveryInformationForm.onCreated(function(){
	this.schema = new SimpleSchema({
		'email': { 
		    type: String,
			regEx: SimpleSchema.RegEx.Email,
		    label: function(){
		        return TAPi18n.__('email')
		    }, 
		},
		'phone': { 
		    type: String,
		    regEx: SimpleSchema.RegEx.SaudiMobile,
		    label: function(){
		        return TAPi18n.__('mobile')
		    }, 
		},
		'deliveryAddress': { 
		    type: String,
		    label: function(){
		        return TAPi18n.__('address')
		    }, optional:true,
	        custom: function(){
	        	if (!this.field("deliveryAddress").isSet && !this.field("location").isSet){
	        		return "addressRequired"
	        	}
	        },		    
		},
		'deliveryDate': { 
		    type: Date,
		    label: function(){
		        return TAPi18n.__('deliveryDate')
		    },
			autoform: {
		      afFieldInput: {
		        type: Modernizr.inputtypes['datetime-local'] ?
		        	"datetime-local": "bootstrap-datetimepicker"
		      }
		    }
		},
		location: {
	        type: Object,
	        autoform: {
	            type: 'map',
	            afFieldInput:{
	            	mapType: 'roadmap',
	            	autolocate: true,
	            	geolocation: false,
	            	zoom:11,
				    defaultLat: 24.68773, defaultLng: 46.72185, //riyad
	            }	        	
	        },
	        label: function(){
	            return TAPi18n.__('locationOnMap')
	        }, optional:true,
	        custom: function(){
	        	if (!this.field("deliveryAddress").isSet && !this.field("location").isSet){
	        		return "addressRequired"
	        	}
	        },      			
		},
	    'location.lat': {
			type: Number,
			decimal: true, optional:true
	    },
	    'location.lng': {
			type: Number,
			decimal: true, optional:true
	    },
	});
});

AutoForm.hooks({
	deliveryInformationForm: {
		onSuccess: function (formType, result) {
			Router.go('settings.purchases');
		}
	}
});


Template.deliveryInformationForm.helpers({
	formCollection(){
		return Template.instance().schema
	},
	defaultValues(){
		return {
			phone: Meteor.user().phone || "",
			email: Meteor.user().emails[0].address
		}
	},
	nextWeek(){
		const nextWeek = new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)
		const format = "YYYY-MM-DDThh:mm"
		moment.locale('en')
		const str = moment(nextWeek).format(format);
		moment.locale('ar')
		return str
	}
})