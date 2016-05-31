import {Items} from './collection'
import {Shops} from './../shops/collection'

import './search'

Meteor.publishComposite('items', function itemsPublication(query, limit){
	return {
		find(){
			//Meteor._sleepForMs(200);
			return Items.find(query, { limit: limit });
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
			//Meteor._sleepForMs(200);
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
