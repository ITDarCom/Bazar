import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FS } from "meteor/cfs:base-package"

import "./template.html"

import { Images } from './../../../api/images'
import { Shops } from './../../../api/shops/collection'

function scrollToTheEnd(){
    setTimeout(function(){
        window.scrollTo(0,document.body.scrollHeight);        
    }, 1000);
}

Template.fileInput.onCreated(function(){

    var instance = this

    instance.fileInProgressId = new ReactiveVar()
    instance.isUploading = new ReactiveVar(false)

    const mode = instance.data.mode

    instance.autorun(function(){

        var fileInProgressId = instance.fileInProgressId.get() //should be null at the beginning
        if (!fileInProgressId){
            return ;           
        } else {

            var fileObj = Images.findOne(fileInProgressId)
            //console.log('fileObj.uploadProgress()', fileObj.uploadProgress())
            
            if (fileObj && fileObj.url()) {


                if (mode == 'shop'){

                    Meteor.call('shops.setLogo', fileObj.url(), fileInProgressId)
                    instance.fileInProgressId.set(null)
                    

                } else if (mode == 'item'){

                    const itemId = instance.data.itemId
                    Meteor.call('items.addThumbnail', itemId, fileObj.url(), fileInProgressId)
                    instance.fileInProgressId.set(null)
                    scrollToTheEnd()

                }

                Template.instance().isUploading.set(false)
            }             
        }

    })
})

Template.fileInput.helpers({
	isUploading(){
		return Template.instance().isUploading.get()
	}
})

Template.fileInput.events({
	'change input[type=file]': function(event, instance) {

        instance.isUploading.set(true)

		FS.Utility.eachFile(event, function(file) {
			file.owner = Meteor.user().shop
			Images.insert(file, function (err, fileObj) {
				// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                if (err) {
                    instance.isUploading.set(false)
                    throw err
                } else {

    	    		instance.subscribe('image', fileObj._id)

	                //fileObj is not reactive until you explicitly fetch it from the db in a reactive context
	                //check this issue: https://github.com/CollectionFS/Meteor-CollectionFS/issues/397
	                instance.fileInProgressId.set(fileObj._id)                	
                }
			});
		});
	}        
})