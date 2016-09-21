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

		if (formType == 'method'){
			const shop = Shops.findOne(result)
			if (shop){
				
	    		Meteor.subscribe('image', shop.logo.imageId)

	    		//don't release the form until we finished upload
	    		Meteor.autorun(function(c){
			        const logo = Images.findOne(shop.logo.imageId)

			        if (logo && logo.url()){

			        	//check again the user has not canceled the process
						const shop = Shops.findOne(result)
						if (shop){
							isUploading.set(false)	
							c.stop()		        	
							Router.go('shops.show', { shop: result })							
						}
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
    onError : function(){
        //a hack to display the error when missing files
        if (this.validationContext._invalidKeys.find(key => key.name.match(/imageId/) )){
            $('.imageId .form-group').addClass('is-focused')            
        }
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
    'click .cancel-btn'(e, instance){ 

		AutoForm.resetForm('insertShopForm')

    	e.preventDefault()
		const route = Router.current().route.getName()

    	if (isUploading.get()){

			//https://github.com/CollectionFS/Meteor-CollectionFS/issues/370#issuecomment-88043692
			var list = FS.HTTP.uploadQueue.processingList()
			_.each(list, function(item) {
			  item.queue.cancel();
			});

            if (route.match(/new/)){
                Meteor.call('shops.remove')                
            }
			isUploading.set(false)

            //a hack to reset the file field, so that user has to upload it again
            //resetFormElement($('.cfsaf-field'))

    	} else {    		
			if (route.match(/new/)){ 
				Router.go('settings.shop')
			} else {
				Router.go('shops.mine')
			}
    	}   	
    }
})