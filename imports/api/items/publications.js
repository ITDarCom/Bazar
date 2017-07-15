import {Items} from './collection'
import {Shops} from './../shops/collection'
import {Images} from './../images'

import './search'

Meteor.publishComposite('items', function itemsPublication(query, limit){
	return {
		find(){
			//Meteor._sleepForMs(200);
			var user = Meteor.users.findOne(this.userId);
			if (user && user.hasShop){
				//query.shop will take value when the user visit shops.show page else query.shop is undefined
				if(!(query.shop  && (user.shop == query.shop))){
				 query.isHidden = false;
				}

			} else {
				query.isHidden = false
			}
			query.isRemoved = false
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
					//console.log('ssssshop')
					//console.log(Shops.find({ _id: item.shop}));
					return Shops.find({ _id: item.shop})
				}
			}
			, 
			{
				find(item){
					const imageIds = _.pluck(item.thumbnails, 'imageId')
					//console.log(imageIds);
					// console.log('dd'); 
					//return Images.find({_id: { $in: imageIds }})
					//console.log('imagesssssssssssss')
					//console.log(Images.find({_id: { $in: imageIds }}));
					return Images.find({_id: { $in: imageIds }}).cursor
					//return Images.find({_id: imageIds}).cursor;
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
