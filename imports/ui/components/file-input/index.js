import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// import { FS } from "meteor/cfs:base-package"
import { FilesCollection } from 'meteor/ostrio:files';
import "./template.html"


import { Images } from './../../../api/images';
import { Shops } from './../../../api/shops/collection';

// console.log(Images)
function scrollToTheEnd(){
    setTimeout(function(){
        $('.thumbnail:last-child').get(0).scrollIntoView()
    }, 1000);
}

Template.fileInput.onCreated(function(){

    var instance = this

    instance.fileInProgressId = new ReactiveVar()
    instance.isUploading = new ReactiveVar(false)
    instance.uploaded = new ReactiveVar(false)


    const mode = instance.data.mode
    instance.mode=mode;
    //alert(mode);
    instance.autorun(function(){

        var fileInProgressId = instance.fileInProgressId.get() //should be null at the beginning
        if (!fileInProgressId){
            return ;           
        } else {

            var fileObj = Images.findOne(fileInProgressId)

            if (fileObj){
                //console.log(fileObj.copies, fileObj.isUploaded(), fileObj.hasStored(), fileObj.uploadProgress())
            }
            
            if (fileObj && fileObj.link()) {

                                    ///auto run
                      // const mode = instance.data.mode
              if (mode == 'shop'){
                    // console.log('fileObj');
                    //  console.log(fileObj);
                    var fileInProgressId = instance.fileInProgressId.get() 
                        
                    //url=fileObj.link();
                        const image = Images.findOne(fileObj._id)
                        // console.log(image)
                    // alert(image.link())
                    url=image.link().replace(Meteor.absoluteUrl().replace(/\/$/,"") , '');
                   Meteor.call('shops.setLogo', url, fileInProgressId)
                    instance.fileInProgressId.set(null)
                    

                } else if (mode == 'item'){
                    var fileInProgressId = instance.fileInProgressId.get() 
                    const itemId = instance.data.itemId
                    const image = Images.findOne(fileObj._id)
                    url=image.link().replace(Meteor.absoluteUrl().replace(/\/$/,"") , '');
                    Meteor.call('items.addThumbnail', itemId, url, fileInProgressId)
                   // Meteor.call('items.addThumbnail', itemId, fileObj.url(), fileInProgressId)
                    instance.fileInProgressId.set(null)
                    scrollToTheEnd()

                }else if(mode=='itemImages'){
                   var fileInProgressId = instance.fileInProgressId.get() 
                    const image = Images.findOne(fileObj._id)
                    url=image.link().replace(Meteor.absoluteUrl().replace(/\/$/,"") , '');
                    Meteor.call('items.setTmpImages', url, fileInProgressId)
                    instance.fileInProgressId.set(null)
                    scrollToTheEnd()
                }
                    //end from auto run

                Template.instance().isUploading.set(false)
            }             
        }

    })
})

Template.fileInput.helpers({
	isUploading(){
		return Template.instance().isUploading.get()
	},
  uploaded(){
    return Template.instance().uploaded.get()
  },
    fileObj(){
        const id = Template.instance().fileInProgressId.get()
        return Images.findOne(id)
    },
    multipleImages(){
     //return Template.instance().mode =='itemImages';
     return false;
    }
})

Template.fileInput.events({
	'change input[type=file]': function(e, instance) {

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected

      const file= e.currentTarget.files[0];
      file.owner = Meteor.user().shop;
      const upload = Images.insert({
        file:file,
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        instance.uploaded.set(false);
        instance.isUploading.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          instance.uploaded.set(true);
         // alert('File "' + fileObj.name + '" successfully uploaded');
          instance.subscribe('image', fileObj._id)

                    //fileObj is not reactive until you explicitly fetch it from the db in a reactive context
                    //check this issue: https://github.com/CollectionFS/Meteor-CollectionFS/issues/397
                    instance.fileInProgressId.set(fileObj._id)  
                    //here

        }
        instance.isUploading.set(false);
      });

      upload.start();
    }
	}        
})