import { FS } from "meteor/cfs:base-package"

var imageStore = new FS.Store.S3("images", {
    accessKeyId: "AKIAJIX3DMTAIYKFDE4A", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "seensaad", //required
    maxTries: 1, //optional, default 5
    folder: 'images'
});

export const Images = new FS.Collection("images", {
    stores: [imageStore]
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
}
