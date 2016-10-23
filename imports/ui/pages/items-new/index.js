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
var resultItemId = new ReactiveVar()

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
    resultItemId.set(null)
})

AutoForm.addHooks('insertItemForm', {
    onSuccess: function (formType, result) {

        const route = Router.current().route.getName();          
        resultItemId.set(result)
        
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
                        resultItemId.set(null)
                        c.stop()
                        Router.go('items.show', {shop: Router.current().params.shop, itemId: result})
                    }
                }             
            })
        } else if (route.match(/edit/)){
            isUploading.set(false)
            resultItemId.set(null)
            const itemId = Router.current().params.itemId             
            Router.go('items.show', {shop: Router.current().params.shop, itemId: itemId})            
        }
    },
    before: {
      method(doc){

        //this is to make upload progress visible for small files
        const files = $('.cfsaf-hidden').get(0).files
        var maxChunckSize = files[0].size /10
        var largeFile = false

        for (var key in files){
            var file = files[key]
            if ((file.size / 10) > maxChunckSize){
                maxChunckSize = file.size / 10
            }    

            if (file.size > (2097152)*10){
                largeFile = true
            }        
        }

        //only if files are small enough
        if (!largeFile){
            //FS.config.uploadChunkSize = maxChunckSize            
        }

        //FS.config.uploadChunkSize = maxChunckSize
        CfsAutoForm.Hooks.beforeInsert.bind(this)(doc)
      }
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
            resultItemId.set(null)
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

    },
    resetOnSuccess(){
        var route = Router.current().route.getName()
        if (route.match(/edit/)){ return true } else { return false }
    },
    fileObjs(){
        const id = resultItemId.get()
        const item = Items.findOne(id)
        if (isUploading.get() && item) return item.imageIds
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
    "click .delete-item-btn": function (event) {
        event.preventDefault()
        var itemId = Router.current().params.itemId;        
        if (confirm(TAPi18n.__('deleteItemConfirmation'))){
             Meteor.call("item.remove", itemId)
             Router.go('shops.mine')
        }
    },
    'click .cancel-btn'(e){

        AutoForm.resetForm('insertItemForm')        

        e.preventDefault()
        const route = Router.current().route.getName()
 
        if (isUploading.get()){

            //https://github.com/CollectionFS/Meteor-CollectionFS/issues/370#issuecomment-88043692
            var list = FS.HTTP.uploadQueue.processingList()
            _.each(list, function(item) {
              item.queue.cancel();
            });

            if (route.match(/new/)){
                Meteor.call('item.remove', resultItemId)                
            }
            isUploading.set(false)
            resultItemId.set(null)

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
