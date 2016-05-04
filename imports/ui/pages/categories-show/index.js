import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

Template.categoriesShow.helpers({
	categoryName(){
		return Router.current().params.category
	}
})
