import {Items} from './collection'
import {Shops} from './../shops/collection'

import './search'

Meteor.publishComposite('items', function itemsPublication(query, limit) {
    return {
        find(){
            //Meteor._sleepForMs(2000);
            return Items.find(query, {limit: limit});
        },
        children: [
            {
                find(item){
                    return Shops.find({_id: item.shop})
                }
            }

        ]
    }
});

Meteor.publishComposite('singleItem', function singleItemPublication(itemId) {
    return {
        find(){
            //Meteor._sleepForMs(2000);
            return Items.find({_id: itemId});
        },
        children: [
            {
                find(item){
                    return Shops.find({_id: item.shop})
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

                return Items.find({_id: {$in: favorites}},{limit: limit});
            }

        },
        children: [
            {
                find(item){
                    return Shops.find({_id: item.shop})
                }
            }

        ]
    }
});