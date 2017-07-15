import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Shops } from './collection'
import { ShopsRemoved } from './collection'
import { Items } from './../items/collection'
import { Purchases } from './../purchases/collection'
import { Threads } from './../threads/collection'
import { Images } from './../images'

Meteor.methods({
	'shops.insert'(doc) {

		check(doc.title, String);
		check(doc.description, String);
		check(doc.city, String);

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var url, imageId = 'dumpId'
		if (doc.logo && doc.logo.imageId){
			//console.log('in insert fun');
			imageId = doc.logo.imageId
			const image = Images.findOne(imageId)
			//url = `/cfs/files/images/${imageId}/${image.original.name}`
			// url='assets/app/uploads/Images/${imageId}';
			// console.log(image.link());
			//url='/downloads/'+image._id+image.extensionWithDot;
			url=image.link().replace(Meteor.absoluteUrl().replace(/\/$/,"") , '');
			// url=image.link();
		}

		const hasShop = Meteor.users.findOne(this.userId).hasShop

		if (!hasShop){

			return Shops.insert({
				title: doc.title,
				description: doc.description,
				city: doc.city,
				createdAt: new Date(),
				logo: {
					url: url, imageId: imageId
				}
			}, (err, shopId) => {
				if (!err) {
					Meteor.users.update({ _id: this.userId}, 
						{ $set: { 'hasShop': true, 'shop': shopId, 'shopTitle': doc.title,'tmpShopLogo.url': null, 'tmpShopLogo.fileId': null } 
					})			
				} else {
					throw err
				}
			});
		}
	},

	'shopTitleAvailable'(title){

		const shop = Shops.findOne({titleLowerCase: title.toLowerCase(), isRemoved: false })

		if (!shop) return true;
		else if (shop){
			if (shop.user == this.userId){
				return true;
			} else {
				return false;
			}
		}
	},

	'shops.update'(modifier, documentId){
		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const oldCity = Shops.findOne(documentId).city

		Shops.update({ _id: documentId }, modifier, function(err, count){

			//if the user edits the city of the shop, modify his old items
			const shop = Shops.findOne(documentId)
			const newCity = shop.city

			if (oldCity != newCity){
				Items.update({shop: documentId}, { $set: { city: newCity} }, { multi: true })
			}

			Meteor.users.update({shop: documentId}, {$set: {'shopTitle': shop.title} })
		})

	},

	'shops.remove'(customUserId){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const userId = customUserId ? customUserId : this.userId

		const hasShop = Meteor.users.findOne(userId).hasShop
		const shop = Meteor.users.findOne(userId).shop
		const shopObj = Shops.findOne(shop)

		if (hasShop){

			Items.update({ shop: shop}, { $set: { isRemoved: true }}, { multi: true })
			ShopsRemoved.insert(shopObj)
			Shops.remove({ _id: shop })

			//if he had any unread message, decrement them from counter then hide them
			const inboxDecrement = Threads.find({ 
				'participants': { $elemMatch: { type:'shop', id:shop, unread: true}} 
			}).count() * (-1)
			Meteor.users.update(userId, { $inc: { 'unreadInbox': inboxDecrement }})
			Threads.update({ 
				'participants': { $elemMatch: { type:'shop', id:shop}} 
			},{ $set: { isRemoved: true }}, { multi: true })

			//rejecting all purchases related to this order
			const purchases = Purchases.find({shop:shop})

			purchases.forEach(function(purchaseItem){
				Meteor.call('orders.process', purchaseItem._id, 'rejected')
			})

			Meteor.users.update({ _id: userId}, 
				{ $set: { 'hasShop': false, 'shop': null } 
			})	

		}


	},
	'shop.hide'(status, customUserId){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const userId = customUserId ? customUserId : this.userId
		const user = Meteor.users.findOne(userId)

		if (user.hasShop) {
			Shops.update({_id: user.shop},{$set: {isHidden: status}});
			Items.update({shop: user.shop},{$set: {isHidden: status}},{multi: true},function(err,res){
				if(!err){
					//console.log(res)
				}else{
					console.log("error is happened")
				}
			});

		}
	},
	'shops.setLogo'(url, fileId){

		check(url, String);
		check(fileId, String);

		if (!Meteor.user().hasShop){
			Meteor.users.update(this.userId, { $set: {'tmpShopLogo.url': url, 'tmpShopLogo.fileId': fileId } })
		} else {
    		Shops.update(Meteor.user().shop, { $set: {'logo.url': url, 'logo.fileId': fileId } });			
		}

	}

});