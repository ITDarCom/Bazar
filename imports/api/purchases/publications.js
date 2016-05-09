import {Purchases} from './collection';

Meteor.publish('cart', function purchasesPublication() {
	console.log('cart')
	return Purchases.find({user: this.userId, status: 'cart' });
});

Meteor.publish('purchases', function purchasesPublication() {
	console.log('purchases')
	return Purchases.find({user: this.userId, status: { $ne: 'cart'} });
});

Meteor.publish('orders', function purchasesPublication() {
	console.log('orders')
	if (this.userId){

		var shop = Meteor.users.findOne(this.userId).profile.shop

		if (shop){
			return Purchases.find({shop: shop, status: 'pending' });			
		} else {
			return this.ready()
		}

	} else {
		return this.ready()
	}

});

Meteor.publish('sales', function purchasesPublication() {
	console.log('sales')
	if (this.userId){

		var shop = Meteor.users.findOne(this.userId).profile.shop

		if (shop){
			
			return Purchases.find({
				shop: shop, 
				$or : [
					{ status : 'accepted' },
					{ status : 'rejected' },
				] 
			});		

		} else {
			return this.ready()
		}

	} else {
		return this.ready()
	}

});