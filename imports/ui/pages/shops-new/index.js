import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

import { Shops } from './../../../api/shops/collection'
import { Cities } from './../../../api/cities/collection.js'
import { Images } from './../../../api/images'

import {CfsAutoForm} from "meteor/cfs:autoform"

var isUploading = new ReactiveVar(false)

Template.insertShopForm.onCreated(function(){
    isUploading.set(false)	
	AutoForm.resetForm('insertShopForm')
	setTimeout(function(){
		$("input[name='logo.imageId']")
			.attr('placeholder', TAPi18n.__('clickToUploadFile'))
			.attr('accept', 'image/*')
	},0)
})

Template.insertShopForm.onDestroyed(function(){
    isUploading.set(false)
})

AutoForm.addHooks('insertShopForm', {
	onSuccess: function(formType, result){
		if(this.validationContext.isValid()){
			Router.go('shops.mine')
		}
	},
	before: {
		method: function(doc){

			//displaying validation error if title is duplicate
			setTimeout(function(){
				if ($('.title .form-group').hasClass('has-error')){
		            $('.title .form-group').addClass('is-focused')
	            	$('.page-header').get(0).scrollIntoView()
		            $('.title .form-group').keyup(function(){
		            	$('.title .form-group').removeClass('is-focused')
		            })
				}				
			},100)

			//console.log(Meteor.user());
			if (!Meteor.user().tmpShopLogo.fileId){

				this.addStickyValidationError('logo.imageId', 'required')

				return false;

			} else {

				this.removeStickyValidationError('logo.imageId', 'required')


				doc.logo = {
					imageId : Meteor.user().tmpShopLogo.fileId,
					url: Meteor.user().tmpShopLogo.url
				}

				return doc;
			}

		}
	},

    beginSubmit: function() {
        isUploading.set(true)
    },
    endSubmit(){
        if (!this.validationContext.isValid()){
            isUploading.set(false)

	        if (this.validationContext._invalidKeys.find(key => key.name.match(/title/) )){
	            $('.title .form-group').addClass('is-focused')
	            $('.page-header').get(0).scrollIntoView()
	            $('.title .form-group').keyup(function(){
	            	$('.title .form-group').removeClass('is-focused')
	            })
	    	}

	        if (this.validationContext._invalidKeys.find(key => key.name.match(/logo/) )){
	            $('.logo .form-group').addClass('is-focused')
	            $('.logo .form-group').addClass('has-error')
	            $('.logo .form-group').append("<span class=\"help-block\">شعار المتجر إلزامي</span>")

	            $("input:file").change(function (){
					var fileName = $(this).val();
					if (fileName){
			            $('.logo .form-group').removeClass('is-focused')
			            $('.logo .form-group').removeClass('has-error')
			            $('.logo span.help-block').remove()
					}
				});
	        }	    	    	
        	
        }
    }
}, true);

Template.insertShopForm.helpers({
    isNew(){
        var route = Router.current().route.getName()        
        return (route.match(/new/))
    },	
	formCollection(){
		return Shops;
	},
	formType(){
		var route = Router.current().route.getName()
		if (route.match(/settings/)) return 'method-update'
		return 'method'
	},
	method(){
		var route = Router.current().route.getName()
		if (route.match(/settings/)) return 'shops.update'
		return 'shops.insert';
	},
	doc(){
		var route = Router.current().route.getName()
		if (route.match(/settings/)){
			return Shops.findOne(Meteor.user().shop)			
		}
	},
	isHidden(){
		const shop = Shops.findOne(Meteor.user().shop)
		if (shop) return shop.isHidden;
	},
	cities: function () {
		return Cities.find({}, { sort: { order: 1}}).fetch().map(function(city){
			return {label:city.label, value:city.identifier}
		})
	},
	resetOnSuccess(){
		var route = Router.current().route.getName()
		if (route.match(/edit/)){ return true } else { return false }
	},
	tmpShopLogo(){
		if(Meteor.user().tmpShopLogo){
			return   Meteor.absoluteUrl().replace(/\/$/,"") + Meteor.user().tmpShopLogo.url;
		}else{
			return false;
		}
	}
})

Template.insertShopForm.events({
    'click .cancel-btn'(e, instance){ 

		AutoForm.resetForm('insertShopForm')

    	e.preventDefault()
		const route = Router.current().route.getName()

		if (route.match(/new/)){ 
			Router.go('settings.shop')
		} else {
			Router.go('shops.mine')
		}
    }
})