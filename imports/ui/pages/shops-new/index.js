import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

import { Shops } from './../../../api/shops/collection'
import { Cities } from './../../../api/cities/collection.js'
import { Images } from './../../../api/images'

import {CfsAutoForm} from "meteor/cfs:autoform"

var isUploading = new ReactiveVar()

Template.insertShopForm.onCreated(function(){
	isUploading.set(false)
	AutoForm.resetForm('insertShopForm')
	setTimeout(function(){
		$("input[name='logo.imageId']").attr('placeholder', TAPi18n.__('clickToUploadFile'))		
	},0)
})

Template.insertShopForm.onDestroyed(function(){
	isUploading.set(false)
})

AutoForm.addHooks('insertShopForm', {
	onSuccess: function(formType, result){
		if (formType == 'method'){
			const shop = Shops.findOne(result)
			if (shop){
	    		Meteor.subscribe('image', shop.logo.imageId)

	    		//don't release the form until we finished upload
	    		Meteor.autorun(function(c){
			        const logo = Images.findOne(shop.logo.imageId)
			        if (logo && logo.url()){
						isUploading.set(false)	
						c.stop()		        	
						Router.go('shops.show', { shop: result })
			        }
	    		})				
			}
		} else {
			Router.go('shops.show', { shop: Meteor.user().shop })
		}
	},
    before: {
      method: CfsAutoForm.Hooks.beforeInsert
    },
    after: {
      method: CfsAutoForm.Hooks.afterInsert
    },
	beginSubmit: function() {
		isUploading.set(true)
	},
	endSubmit: function() {
        if (!this.validationContext.isValid()){
			isUploading.set(false)
        }
	}	
}, true);

Template.insertShopForm.helpers({
	isUploading(){
		return isUploading.get()
	},
	disabled(){
		if (isUploading.get()){
			return "disabled"
		} else { return "" }
	},
    isNew(){
        var route = Router.current().route.getName()        
        return (route.match(/new/))
    },	
	formCollection(){
		return Shops;
	},
	formType(){
		if (isUploading.get()){ return "disabled" }
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
		return Shops.findOne(Meteor.user().shop).isHidden;
	},
	cities: function () {
		return Cities.find().fetch().map(function(city){
			return {label:city.label, value:city.identifier}
		})
	}
})

Template.insertShopForm.events({
    'click .cancel-btn'(e){ 

    	e.preventDefault()
		const route = Router.current().route.getName()

    	if (isUploading.get()){
    		//FS.HTTP.uploadQueue.cancel() //doesn't seem to work    		
            if (route.match(/new/)){
                Meteor.call('shops.remove')                
            }
			isUploading.set(false)

    	} else {    		
			if (route.match(/new/)){ 
				Router.go('settings.shop')
			} else {
				Router.go('shops.mine')
			}
    	}   	
    }
})