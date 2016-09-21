import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'
import { Categories } from './../../../api/categories/collection'

import { Images } from './../../../api/images'

import {CfsAutoForm} from "meteor/cfs:autoform"

Template.itemsNewPage.helpers({
	shop(){
		return Shops.findOne(Meteor.user().shop)
	}
})

var isUploading = new ReactiveVar(false)
var resultItemId = null

Template.insertItemForm.onCreated(function(){
    isUploading.set(false)
    AutoForm.resetForm('insertItemForm')
    setTimeout(function(){
        $("input[name='imageIds']").attr('placeholder', TAPi18n.__('clickToUploadFiles'))  
        $("input[type='file']").attr('accept', 'image/*')      
    },0)
})

Template.insertItemForm.onDestroyed(function(){
    isUploading.set(false)
})

AutoForm.addHooks('insertItemForm', {
    onSuccess: function (formType, result) {

        const route = Router.current().route.getName();  
        resultItemId = result 
        
        if (route.match(/new/)){            
            Meteor.subscribe('singleItem', result)
            Meteor.autorun(function(c){
                const item = Items.findOne(result)
                if (item){

                    item.imageIds.forEach(function(imageId){
                        Meteor.subscribe('image', imageId)                
                    })

                    //don't release the form until we finished upload
                    const images = Images.find({ _id: { $in : item.imageIds } }).fetch()
                    const length = images.length
                    
                    if (length && images[length-1].url({ store: 'images' })){
                        isUploading.set(false)
                        c.stop()
                        Router.go('items.show', {shop: Router.current().params.shop, itemId: result})
                    }
                }             
            })
        } else if (route.match(/edit/)){
            isUploading.set(false)
            const itemId = Router.current().params.itemId             
            Router.go('items.show', {shop: Router.current().params.shop, itemId: itemId})            
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
        if (this.validationContext._invalidKeys.find(key => key.name == 'imageIds' )){
            $('.imageIds .form-group').addClass('is-focused')            
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

Template.insertItemForm.helpers({
    isUploading(){
        return isUploading.get()
    },
    disabled(){
        if (isUploading.get()){
            return "disabled"
        } else { return "" }
    },    
    formCollection(){
        return Items;
    },
    formType(){
        if (isUploading.get()){ return "disabled" }        
        var route = Router.current().route.getName()
        if (route.match(/edit/)) return 'method-update'
        return 'method'
    },
    isNew(){
        var route = Router.current().route.getName()        
        return (route.match(/new/))
    },
    method(){
        var route = Router.current().route.getName()
        if (route.match(/edit/)) return 'items.update'
        return 'items.insert'
    },
    doc(){
        return Items.findOne(Router.current().params.itemId)
    },
    categories: function () {
        return Categories.find().fetch().map(function (category) {
            return {
                label: category.label,
                value: category.identifier
            }
        });
    },
    isHidden: function () {
        var item = Items.findOne(Router.current().params.itemId);
        if (item){
            return item.isHidden;
        }

    }
})

Template.insertItemForm.events({
    'click .hide-item-btn': function (event) {
        event.preventDefault()
        var itemId = Router.current().params.itemId;
        var item = Items.findOne(itemId);
        var shop = Shops.findOne({user: Meteor.userId()})
        if (shop.isHidden && item.isHidden) {
            alert(TAPi18n.__('youCannothideItem'));
            return
        }
        var status = !item.isHidden
        Meteor.call("item.hide",itemId,status)
    },
    'click .cancel-btn'(e){

        e.preventDefault()
        const route = Router.current().route.getName()
 
        if (isUploading.get()){
            //FS.HTTP.uploadQueue.cancel() //doesn't seem to work         
            if (route.match(/new/)){
                Meteor.call('item.remove', resultItemId)                
            }
            isUploading.set(false)

            //a hack to reset the file field, so that user has to upload it again
            $('.cfsaf-field').val('')

        } else {

            if (route.match(/edit/)){
                Router.go('items.show', {
                    shop: Router.current().params.shop, 
                    itemId: Router.current().params.itemId
                })            
            } else {
                Router.go('shops.mine')
            }

        }
    }    
})
