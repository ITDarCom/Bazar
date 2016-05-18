import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'

import './template.html'

Template.itemThumbnail.helpers({
    shop(){    	
    	if (Template.instance().data)
        	return Shops.findOne(Template.instance().data.shop)   
    },
    defaultThumbnail(){
    	if (Template.instance().data)
    		return Template.instance().data.thumbnails[0].url
    }
})