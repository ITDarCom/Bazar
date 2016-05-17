import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

Template.itemsEditPage.onCreated(function(){
	this.itemId = Router.current().params.itemId
	this.subscribe('singleItem', this.itemId)
})
