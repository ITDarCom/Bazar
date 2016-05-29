import {Purchases} from './collection';
import {Items} from './../items/collection'
import {Shops} from './../shops/collection'

var children = 
	[
		{
			find(purchase){
				return Items.find({ _id: purchase.item})
			},
			children : [
				{
					find(item){
						return Shops.find({ _id: item.shop})
					}
				}
			]		
		},
		{
			find(purchase){
				return Meteor.users.find({ _id: purchase.user})
			}
		},
	]

Meteor.publishComposite('cart', function cartPublication(){
	return {
		find(){
			Meteor._sleepForMs(200);
			return Purchases.find({user: this.userId, status: 'cart' }, { sort: { createdAt: -1 }});
		}, 
		children : children
	}
});

Meteor.publishComposite('purchases', function purchasesPublication(){
	return {
		find(){
			Meteor._sleepForMs(200);
			return Purchases.find({user: this.userId, status: { $ne: 'cart'}}, { sort: { createdAt: -1 }});
		}, 
		children : children
	}
});

Meteor.publishComposite('orders', function ordersPublication(){
	return {
		find(){
			Meteor._sleepForMs(200);
			if (!this.userId) this.ready();
			var shop = Meteor.users.findOne(this.userId).profile.shop;
			if (!shop) this.ready();
			return Purchases.find({shop: shop, status: 'pending' }, { sort: { createdAt: -1 }});
		}, 
		children : children
	}
});

Meteor.publishComposite('sales', function salesPublication(){
	return {
		find(){
			Meteor._sleepForMs(200);
			if (!this.userId) this.ready();
			var shop = Meteor.users.findOne(this.userId).profile.shop;
			if (!shop) this.ready();
			return Purchases.find({
				shop: shop, 
				$or : [
					{ status : 'accepted' },
					{ status : 'rejected' },
				] 
			});				
		}, 
		children : children
	}
});
