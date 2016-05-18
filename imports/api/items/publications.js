import {Items} from './collection'
import {Shops} from './../shops/collection'

Meteor.publishComposite('items', function itemsPublication(query, limit){
	return {
		find(){
			//Meteor._sleepForMs(2000);
			return Items.find(query);
		}, 
		children : [
			{
				find(item){
					return Shops.find({ _id: item.shop})
				}
			}

		]
	}
});

Meteor.publishComposite('singleItem', function singleItemPublication(itemId){
	return {
		find(){
			//Meteor._sleepForMs(2000);
			return Items.find({ _id: itemId });
		}, 
		children : [
			{
				find(item){
					return Shops.find({ _id: item.shop})
				}
			}

		]
	}
});