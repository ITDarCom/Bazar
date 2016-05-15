import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router';
import { Purchases } from './../../../api/purchases/collection'

import './template.html'

Template.cartPage.onCreated(function(){
	this.showDeliveryForm = new ReactiveVar(false);
});

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
	//we need to assign a unique formId for each autoform. 
	//check this github issue: https://github.com/aldeed/meteor-autoform/issues/298
	cartItemFormId(){
		return Template.instance().formId
	}
})

Template.cartItem.events({
	'click .remove-cart-item-btn': function (event, instance){
		Meteor.call('cart.removePurchase', instance.data._id)
	}	
});

Template.deliveryInformationForm.onCreated(function(){
	this.schema = new SimpleSchema({
	    phone: {
	        type: String,
	        label: "Your phone",
	    },
	    email: {
	        type: String,
	        regEx: SimpleSchema.RegEx.Email,
	        label: "E-mail address"
	    },
	    deliveryAddress: {
	        type: String,
	        label: "Address",
	        max: 1000
	    },
	    deliveryDate: {
	        type: Date,
	        label: "Delivery Date"
	    }
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
			phone:'defaultPhone',
			email:'defaultEmail',
			deliveryDate: new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)
		}
	}
})