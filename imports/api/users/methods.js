/**
 * Created by kasem on 29.05.2016.
 */

Meteor.methods({

    makeFavorite : function (itemId){
        check(itemId, String);
        if (this.userId){
            if(!Meteor.users.findOne({_id: this.userId, favorites: {$in: [itemId]}})) {

                Meteor.users.upsert({_id: this.userId}, {$addToSet: {favorites: itemId}});

            }
            else {

                Meteor.users.update({_id: this.userId}, {$pull: {favorites: itemId}});

            }



        }
    }

});