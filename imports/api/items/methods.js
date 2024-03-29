import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Items } from './collection'
import { Images } from './../images'
import { Purchases } from './../purchases/collection'


function authorizeIfOwner(itemId){
	// Make sure the user is logged in and is owner of item
	const user = Meteor.users.findOne(this.userId)
	const item = Items.findOne(itemId)
	if (! this.userId || item.shop != user.shop) {
		throw new Meteor.Error('not-authorized');
	}	
}

Meteor.methods({
	'items.insert'(doc) {

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var thumbnails = [], imageIds = []
		if (doc.imageIds){
			doc.imageIds.forEach(function(imageId, index){
				const image = Images.findOne(imageId)
				//url = `/cfs/files/images/${image._id}/${image.original.name}`
				url=image.link().replace(Meteor.absoluteUrl().replace(/\/$/,"") , '');
				thumbnails.push({ url: url, imageId: imageId, order: index + 1})
				imageIds.push(imageId)
			})
		}
		// if (doc.images){
		// 	doc.images.forEach(function(image, index){
		// 		//const image = Images.findOne(image.imageId)
		// 		thumbnails.push({ url: image.url, imageId: image.imageId, order: index + 1})
		// 		imageIds.push(image.imageId)
		// 	})
		// }

		if (!imageIds.length){ imageIds.push('dummyId')}

		const hasShop = Meteor.users.findOne(this.userId).hasShop

		if (hasShop){

			return Items.insert({
				title: doc.title,
				description: doc.description,
				price: doc.price,
				category: doc.category,
				thumbnails: thumbnails,
				imageIds: imageIds
			}, (err, shopId) => {
				if (err) {
					throw err
				}else{
					Meteor.users.update(this.userId, { $set: {'tmpItemImages': [] } });
				}
			});
		} 
	},
	'items.update'(modifier, documentId){

		//authorizeIfOwner(documentId)

		Items.update({ _id: documentId }, modifier, documentId);

	},
	'item.remove'(itemId) {
		
		//authorizeIfOwner(itemId)

		Items.update(itemId, { $set: {isRemoved: true} }, function(err, count){
			if (err) throw err
			if (count){

				//rejecting all purchases related to this order
				const purchases = Purchases.find({item:itemId})

				purchases.forEach(function(purchaseItem){
					Meteor.call('orders.process', purchaseItem._id, 'rejected')
				})
			}
		})
	},
	'item.hide'(itemId,status){

		//authorizeIfOwner(itemId)

		check(itemId, String);
		check(status, Boolean);


		var item = Items.findOne(itemId)
		if(item){
			Items.update({_id: itemId},{isHidden: status});
		}

	},
	'items.addThumbnail'(itemId, url, imageId){

		//authorizeIfOwner(itemId)

		check(itemId, String);
		check(url, String);
		check(imageId, String);

		const item = Items.findOne(itemId)
		const order = item.thumbnails.length + 1

    	Items.update(itemId, { $push: {'thumbnails': {url:url, imageId, imageId, order:order} } });		
	},
	'items.removeThumbnail'(itemId, imageId){

		//authorizeIfOwner(itemId)

		check(itemId, String);
		check(imageId, String);

        const item = Items.findOne(itemId)
		const thumbnail = item.thumbnails.find(thumb => thumb.imageId == imageId )        
        const oldOrder = thumbnail.order

        const count = item.thumbnails.length - 1

        const index = item.thumbnails.indexOf(thumbnail)
        var updatedThumbnails = item.thumbnails.concat()
        updatedThumbnails.splice(index, 1)

        updatedThumbnails = updatedThumbnails.map(function(thumb){
        	if (thumb.order > oldOrder){
        		thumb.order = thumb.order -1
        	}
    		return thumb
        })

    	Items.update({ _id: itemId}, {$set: {'thumbnails': updatedThumbnails }} )

	},
	'items.thumbnailUp'(itemId, imageId){

		//authorizeIfOwner(itemId)

		check(itemId, String);
		check(imageId, String);

		const item = Items.findOne(itemId)
		const thumbnail = item.thumbnails.find(thumb => thumb.imageId == imageId )

        const oldOrder = thumbnail.order
        const newOrder = thumbnail.order - 1

        if (newOrder > 0){
            Items.update({ _id: itemId, 'thumbnails.order': newOrder }, {$set: {'thumbnails.$.order': oldOrder }})
            Items.update({ _id: itemId, 'thumbnails.imageId': imageId }, {$set: {'thumbnails.$.order': newOrder }})
        }
	},
	'items.thumbnailDown'(itemId, imageId){

		//authorizeIfOwner(itemId)

		check(itemId, String);
		check(imageId, String);

		const item = Items.findOne(itemId)
		const thumbnail = item.thumbnails.find(thumb => thumb.imageId == imageId )

        const oldOrder = thumbnail.order
        const newOrder = thumbnail.order + 1

        const count = item.thumbnails.length

        if (newOrder <= count){
            Items.update({ _id: itemId, 'thumbnails.order': newOrder }, {$set: {'thumbnails.$.order': oldOrder }})
            Items.update({ _id: itemId, 'thumbnails.imageId': imageId }, {$set: {'thumbnails.$.order': newOrder }})
        }
	},
	'items.setTmpImages'(url, fileId){

		check(url, String);
		check(fileId, String);

		if (!Meteor.user().hasShop){
			
		} else {
			Meteor.users.update(this.userId, { $push: {'tmpItemImages': {url:url,imageId:fileId} } });
		}

	},
	'items.removeTmpImage'(fileId){
		check(fileId, String);

		if (!Meteor.user().hasShop){
			
		} else {
			Meteor.users.update(this.userId, { $pull: {'tmpItemImages': {imageId:fileId} } });
		}

	}
})
