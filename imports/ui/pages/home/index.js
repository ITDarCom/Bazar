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
				isTall: category.label.indexOf(' ') >= 0,
				path: Router.path('categories.show', { category: category.identifier })})
		})
	},
	icons(identifier){

		switch (identifier){
			case 'deserts': return 'flaticon-food-12'; break;
			case 'Main-course': return 'flaticon-food'; break;
			case 'pateseries': return 'flaticon-cooking'; break;
			case 'Appetizer': return 'flaticon-food-5'; break;
			case 'Frozen-food': return 'flaticon-snowflake'; break;
			case 'Other': return 'flaticon-food-7'; break;
		}

		return 'flaticon-chef'
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