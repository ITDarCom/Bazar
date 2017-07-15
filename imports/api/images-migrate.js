console.log("Migrate-Images Start");

//START MY CODE
import { Meteor } from 'meteor/meteor';
import { Shops } from './shops/collection.js'
import { Items } from './items/collection.js'
//CFS
import { FS } from "meteor/cfs:base-package"
FS.Debug = true
var imageStore = new FS.Store.S3("images", {
    accessKeyId: "AKIAJJKU2FNCCJPBGYMA", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "ebazaaronline", //required
    maxTries: 3, //optional, default 5
    folder: 'images',
});

const Docs = new FS.Collection("images", {
    stores: [ imageStore]
});

//ostrio
import fs from 'fs';
import { Images } from './images'

// END MY CODE
let bound = Meteor.bindEnvironment(function (callback) {
  return callback();
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
 
// This is CFS file collection, change Docs to whatever name used in your code - Images, etc.
// run through every single document/file that is stored in CFS and move one by one to Meteor-Files.
Docs.find().forEach(function (fileObj) {
  console.log("Migrate-Images  File: "+fileObj.name());


  // This directory must be writable on server, so a test run first
  // We are going to copy the files locally, then move them to S3
  let fileName    = './assets/app/uploads/' + fileObj.name();
  let oldFileName = fileObj.name();
  let newFileName = fileObj.name();
  let fileId      = fileObj._id;
  let fileExtension = fileObj.extension();
 
  // This is "example" variable, change it to the userId that you might be using.
  let userId   = fileObj.userId;

  let fileType = fileObj.type();
  let fileSize = fileObj.size();

  var readStream  = fileObj.createReadStream('images');
  var writeStream = fs.createWriteStream(fileName);

  writeStream.on('error', function (err) {
    console.log('Migrate-Images Writing error: ', err, fileName);
  });

  writeStream.on('end', function () {
    console.log('Migrate-Images Writing Ended: ', fileName);
  });


  // Once we have a file, then upload it to our new data storage
  readStream.on('end', function () {  

    console.log('Migrate-Images Ended: ' + fileName);
    // UserFiles is the new Meteor-Files/FilesCollection collection instance
    
    Images.addFile(fileName, {
      fileName: newFileName,
      type: fileType,
      meta: {
        userId: userId // not really needed, I use it for tampering detection
      },
      userId: userId,
      size: fileSize
    },
     (err, fileRef) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Migrate-Images File Inserted: ', fileRef._id);
        //example link in meteor-files collection
        //http://localhost:3000/cdn/storage/Images/NgqzigtcBHuToYgYR/original/NgqzigtcBHuToYgYR.jpg

       //update shops collecion 
        var shops = Shops.find({"logo.imageId":fileId });
        shops.forEach(function (shopObj) {
          console.log('shops: update one');
          Shops.update({_id:shopObj._id},{$set:{
            'logo.imageId':fileRef._id,
            'logo.url':"/cdn/storage/Images_v2/"+fileRef._id+"/original/"+fileRef._id+"."+fileExtension
          }})
        });

        //update items collecion 
        Items.update({'thumbnails.imageId':fileId},{$set:{
            'thumbnails.$.imageId':fileRef._id,
            'thumbnails.$.url':"/cdn/storage/Images_v2/"+fileRef._id+"/original/"+fileRef._id+"."+fileExtension
        }})
 
       var items = Items.find({ imageIds: fileId});
       items.forEach(function(itemObj){
          Items.update(
              { _id: itemObj._id},
              { $pull:{ imageIds : fileId  } }
            );

           Items.update(
              { _id: itemObj._id},
              { $push:{ imageIds : fileRef._id  } }
            );

       });

        // Set the userId again
        Images.update({_id: fileRef._id}, {$set: {userId: userId}});
      }
    },
    false,
);
  });

  readStream.on('error', (error) => {
    console.log('Migrate-Images Error: ', fileName, error);
  });

  readStream.pipe(writeStream);
});