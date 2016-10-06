import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Shops } from './collection'
import { Items } from './../items/collection'

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
			imageId = doc.logo.imageId
			const image = Images.findOne(imageId)
			url = `/cfs/files/images/${imageId}/${image.original.name}`
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
						{ $set: { 'hasShop': true, 'shop': shopId, 'tmpShopLogo.url': null, 'tmpShopLogo.url': null } 
					})			
				} else {
					throw err
				}
			});
		}
	},

	'shopTitleAvailable'(title){

		const shop = Shops.findOne({titleLowerCase: title.toLowerCase() })

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
			const newCity = Shops.findOne(documentId).city

			if (oldCity != newCity){
				Items.update({shop: documentId}, { $set: { city: newCity} }, { multi: true })
			}
		})

	},

	'shops.remove'(){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const hasShop = Meteor.users.findOne(this.userId).hasShop
		const shop = Meteor.users.findOne(this.userId).shop

		if (hasShop){

			Items.remove({ shop: shop})
			Shops.remove({ _id: shop })
			//Purchases.remove({ _id: shop })

			Meteor.users.update({ _id: this.userId}, 
				{ $set: { 'hasShop': false, 'shop': null } 
			})	

		}


	},
	'shop.hide'(status){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var user = Meteor.users.findOne(this.userId)

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