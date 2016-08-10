import { FS } from "meteor/cfs:base-package"

var resize = function(fileObj, readStream, writeStream) {
  // Do not allow an image of a width or height more than 335px
  gm(readStream, fileObj.name()).resize('335', '335', '>').stream().pipe(writeStream);
};

var imageStore = new FS.Store.S3("images", {
    accessKeyId: "AKIAJIX3DMTAIYKFDE4A", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "seensaad", //required
    maxTries: 1, //optional, default 5
    folder: 'images'
});

var createThumb = function(fileObj, readStream, writeStream) {
  // Thumbnail width or height will be at least 170px 
  gm(readStream, fileObj.name()).resize('130', null, '^').stream().pipe(writeStream);
};

var thumbStore = new FS.Store.S3("thumbnails", {
    accessKeyId: "AKIAJIX3DMTAIYKFDE4A", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "seensaad", //required
    maxTries: 1, //optional, default 5
    folder: 'thumbnails',
    transformWrite: createThumb
});

export const Images = new FS.Collection("images", {
    stores: [thumbStore, imageStore]
});

Images.allow({
    download: function () {
        return true;
    },
    insert: function () {
        return true
    },
    update: function () {

        return true;
    },
    remove: function () {
        return true
    }
});

if (Meteor.isServer){
    Meteor.publish('image', function imagesPub(imageId) {
        //Meteor._sleepForMs(200);
        return Images.find({_id: imageId});
    });
    Meteor.publish('images', function imagesPub(imageIds) {
        //Meteor._sleepForMs(200);
        return Images.find({_id: imageIds});
    });    
}
