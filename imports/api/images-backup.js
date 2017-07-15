import { FS } from "meteor/cfs:base-package"

var resize = function(fileObj, readStream, writeStream) {
  // Do not allow an image of a width or height more than 335px
  gm(readStream, fileObj.name()).resize(null, '200', '>').stream().pipe(writeStream);
};

FS.Debug = true

var imageStore = new FS.Store.S3("images", {
    accessKeyId: "AKIAJJKU2FNCCJPBGYMA", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "ebazaaronline", //required
    maxTries: 3, //optional, default 5
    folder: 'images',
    transformWrite: resize
});

var createThumb = function(fileObj, readStream, writeStream) {
  // Thumbnail width or height will be at least 170px 
  gm(readStream, fileObj.name()).resize('150', null, '^').stream().pipe(writeStream);
};

var thumbStore = new FS.Store.S3("thumbnails", {
    accessKeyId: "AKIAJJKU2FNCCJPBGYMA", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "ebazaaronline", //required
    maxTries: 3, //optional, default 5
    folder: 'thumbnails',
    transformWrite: createThumb
});

var createMicroThumb = function(fileObj, readStream, writeStream) {
  // Thumbnail width or height will be at least 170px 
  gm(readStream, fileObj.name()).resize('50', null, '>').stream().pipe(writeStream);
};

var microthumbStore = new FS.Store.S3("microthumbnails", {
    accessKeyId: "AKIAJJKU2FNCCJPBGYMA", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "ebazaaronline", //required
    maxTries: 3, //optional, default 5
    folder: 'microthumbnails',
    transformWrite: createMicroThumb
});

export const Images = new FS.Collection("images", {
    stores: [thumbStore, imageStore, microthumbStore]
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
