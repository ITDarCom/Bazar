import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'

import { Threads } from './../../../api/threads/collection'

import './template.html'

Template.threadPage.onCreated(function(){

	this.inboxType = Router.current().params.inbox
	this.threadId = Router.current().params.thread
	this.ready = new ReactiveVar(false)

	this.autorun(()=>{
		var sub = this.subscribe('singleThread', this.threadId)
		this.ready.set(sub.ready())
	    if (sub.ready()){
	    	this.ready.set(sub.ready())
	    }
	})

	if (Threads.findOne(this.threadId)){

		const thread = Threads.findOne(this.threadId)
		var unread = false
		if (this.inboxType.match(/personal/)){
			unread = thread.participants.find(p => {
				return (p.id == Meteor.userId()) && (p.type == 'user')
			}).unread			
		} else {
			unread = thread.participants.find(p => {
				return (p.id == Meteor.user().profile.shop) && (p.type == 'shop')
			}).unread
		}
		if (unread){
			Meteor.call('threads.markAsRead', Router.current().params.thread, Router.current().params.inbox)				
		}
	}


})

Template.threadPage.helpers({
	thread(){
		return Threads.findOne(Template.instance().threadId)
	},
})

Template.threadPage.events({
	"keypress textarea[name='message']": function(e, instance){
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault()
			const body = e.target.value.trim()
		    Meteor.call('threads.addMessage', Template.instance().threadId, Template.instance().inboxType, body)
		    e.target.value = ""
		}
	}
})

Template.message.helpers({
	isFromMe(){
		const inboxType = Router.current().params.inbox

		const author = Template.instance().data.author

		if (inboxType.match(/personal/)){
			return (author.type == 'user') && (author.id == Meteor.userId())
		} else {
			return (author.type == 'shop') && (author.id == Meteor.user().profile.shop)
		}
	}
})