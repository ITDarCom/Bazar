import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'

import { Threads } from './../../../api/threads/collection'
import { Shops } from './../../../api/shops/collection'

import {recipientHelper} from './helpers'
import {recipientIsShopOwner} from './helpers'

import './template.html'

Template.threadPage.onCreated(function(){

	this.inboxType = Router.current().params.inbox
	this.threadId = Router.current().params.thread
	this.ready = new ReactiveVar(false)

	this.autorun(()=>{
		var sub = this.subscribe('singleThread', this.threadId)
		this.ready.set(sub.ready())
	    if (sub.ready()){
	    	this.thread = Threads.findOne(this.threadId)
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
	recipient(){
		return recipientHelper(Template.instance().thread, Template.instance().inboxType)
	},
	recipientIsShopOwner(){
		return recipientIsShopOwner(Template.instance().thread, Template.instance().inboxType)
	}	
})

Template.threadPage.onRendered(function(){
	//scroll to the bottom of the page
	setTimeout(function(){
    	window.scrollTo(0,document.body.scrollHeight);		
	},100)
})

Template.threadPage.events({
	"keypress textarea[name='message']"(event, instance){
		if (event.keyCode == 13 && !event.shiftKey) {
			event.preventDefault()
			const body = event.target.value.trim()
		    Meteor.call('threads.addMessage', Template.instance().threadId, Template.instance().inboxType, body)
		    event.target.value = ""
	    	//scroll to the bottom of the page
		    window.scrollTo(0,document.body.scrollHeight);
		}
	},
	"click .send-message-btn"(event, instance){
		const body = $("textarea[name='message']")[0].value
	    Meteor.call('threads.addMessage', Template.instance().threadId, Template.instance().inboxType, body)
	    $("textarea[name='message']")[0].value = ""
    	//scroll to the bottom of the page
	    window.scrollTo(0,document.body.scrollHeight);
	},
	"click .back-btn"(event, instance){
		event.preventDefault()
		const route = `inbox.${Template.instance().inboxType}`
		Router.go(route)
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
	},
	avatar(){
		const author = Template.instance().data.author
		if (author.type == 'user'){
			return Meteor.users.findOne(author.id).avatar
		} else {
			return Shops.findOne(author.id).logo
		}
	}

})


Template.messageModal.helpers({
	modalId(){
		return Template.instance().data.modalId
	},
})

Template.messageModal.events({
	"keypress textarea[name='message']": function(e, instance){
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault()
			const body = e.target.value.trim()
			const data = Template.instance().data
		    Meteor.call('threads.sendMessage', data.recpientType, data.recpientId, data.inboxType, body)
		    e.target.value = ""
		    $(`#${data.modalId}`).modal('toggle')
		}
	},
	"click .send-message-btn"(event, instance){
		const body = $("textarea[name='message']")[0].value
		const data = Template.instance().data
	    Meteor.call('threads.sendMessage', data.recpientType, data.recpientId, data.inboxType, body)
	    $("textarea[name='message']")[0].value = ""
	    console.log(`#${data.modalId}`)
		$(`#${data.modalId}`).modal('toggle')
	},		
})