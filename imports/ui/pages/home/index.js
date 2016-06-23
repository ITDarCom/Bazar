import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection.js'
import { Shops } from './../../../api/shops/collection.js'

Template.mainNav.helpers({
	categories(){
		var categArr = Categories.find({}).fetch()
		var sortedCategArr = _.sortBy(categArr, function(categ){ return categ.order; });
		return sortedCategArr.map(function(category){
			return _.extend(category, { 
				path: Router.path('categories.show', { category: category.identifier })})
		})
	}
});

Template.mainNav.onRendered(function(){
	/*$("#main-nav").affix({
	    offset: { 
	        top: 200 //data-offset-top="400"
	    }
	});
	//Scrollspy initialisation  
	$('body').scrollspy({ target: '#main-nav' });*/	
})