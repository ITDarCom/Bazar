import {Items} from './collection'
import {Shops} from './../shops/collection'

import './search'

Meteor.publishComposite('items', function itemsPublication(query, limit){
	return {
		find(){
			//Meteor._sleepForMs(200);
			var user = Meteor.users.findOne(this.userId);
             if(user && user.profile && user.profile.hasShop){
				 //query.shop will take value when the user visit shops.show page else query.shop is undefined
				 if(!(query.shop  && (user.profile.shop == query.shop))){
					 query.isHidden = false;
				 }

			 }else {
				 query.isHidden = false
			 }
			return Items.find(query, { limit: limit, sort: { createdAt: -1 } });
		}, 
		children : [
			{
				find(item){
					return Shops.find({ _id: item.shop,isHidden:false})
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


Meteor.publishComposite('favoriteItems', function itemsPublication(query, limit) {
    return {
        find(){
            var user = Meteor.users.findOne({_id: this.userId});
            if (user) {

                var favorites = user.favorites;
                if (!favorites){
                    favorites = [];
                }
                return Items.find({_id: {$in: favorites},isHidden: false},{limit: limit});
            }
        },
        children: [
            {
                find(item){
                    return Shops.find({_id: item.shop,isHidden: false})
                }
            }

        ]
    }
});
