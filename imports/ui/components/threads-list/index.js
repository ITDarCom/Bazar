import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import { Threads } from './../../../api/threads/collection'

import './template.html'

Template.threadsList.onCreated(function(){

	this.inboxType = new ReactiveVar()

	//subscribing to the appropriate channel on server
	this.autorun(()=>{
		var route = Router.current().route.getName()
		var inboxType = route.match(/inbox.(\w+)/)[1] //purchases, orders or sales

		this.subscribe('inbox', { inboxType: inboxType})
		this.inboxType.set(inboxType)
	})
})

Template.threadsList.helpers({
	threads(){
		return Threads.find()
	}
})
