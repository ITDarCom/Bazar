import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'
import './template.html'
import './style.css'

Template.itemThumbnail.helpers({
    shop(){    	
    	if (Template.instance().data)
        	return Shops.findOne(Template.instance().data.shop)   
    },
    defaultThumbnail(){
    	if (Template.instance().data)
    		return Template.instance().data.thumbnails[0].url
    },
    favorite(){
        if (Meteor.userId()) {
            return Meteor.users.findOne({_id: Meteor.userId(), favorites: {$in: [this._id]}});
        }
    }
})

Template.itemThumbnail.events({
    "click .favorite-btn": function (){
        if (Meteor.userId()) {
            Meteor.call("makeFavorite",this._id);
        }
    }
});