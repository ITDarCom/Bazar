import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'

import { Threads } from './../../../api/threads/collection'
import { Shops } from './../../../api/shops/collection'

import {recipientHelper} from './helpers'
import {recipientIsShopOwner} from './helpers'

import './template.html'

function scrollToTheEnd(){
	//we scroll after a bit so we scroll after new items have been rendered
	setTimeout(function(){
		//we add 100px because of thread footer
		window.scrollTo(0,document.body.scrollHeight + 100);		
	}, 0);
}

function keepFocus(textarea){
	textarea.focus()
}

//start of js code to detect if user is active

var timeoutID;
 
function setupInactiveTimer() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);
 
    startTimer();
}
 
function startTimer() {
    // wait 2 seconds before calling goInactive
    timeoutID = window.setTimeout(goInactive, 1000);
}
 
function resetTimer(e) {
    window.clearTimeout(timeoutID); 
    goActive();
}
 
function goInactive() {
	//Meteor.call('threads.setInactive', Meteor.userId(), Router.current().params.thread)
    // do something
}
 
function goActive() {
    // do something
	Meteor.call('threads.markAsUnread', false, Router.current().params.thread, Router.current().params.inbox, false);
	//Meteor.call('threads.setActive', Meteor.userId(), Router.current().params.thread)         
    startTimer();
}

//end of js code to detect if user is active


//start of js code to detect if keyboard is open
//REF: http://stackoverflow.com/questions/11600040/jquery-js-html5-change-page-content-when-keyboard-is-visible-on-mobile-devices
var is_keyboard = false;
var is_landscape = false;
var initial_screen_size = window.innerHeight;

/* Android */
window.addEventListener("resize", function() {
    is_keyboard = (window.innerHeight < initial_screen_size);
    is_landscape = (screen.height < screen.width);

    updateViews();
}, false);

/* iOS */
$("textarea").bind("focus blur",function() {
    $(window).scrollTop(10);
    is_keyboard = $(window).scrollTop() > 0;
    $(window).scrollTop(0);
    updateViews();
});

function updateViews(){
	scrollToTheEnd();
}

//end of js code to detect if keyboard is open


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
				return (p.id == Meteor.user().shop) && (p.type == 'shop')
			}).unread
		}
		if (unread){
			Meteor.call('threads.markAsUnread', false, Router.current().params.thread, Router.current().params.inbox, false)				
		}
	}

	this.autorun(()=>{
    	const thread = Threads.findOne(this.threadId)
    	if (thread){
	    	const count = thread.messages.length
	    	if (count > 0){
	    		scrollToTheEnd()				
	    	}    		
    	}
	})


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
    	scrollToTheEnd()
	},100);

	//scroll to the bottom when keyboard closed on mobile
	$(document).on('blur', "textarea[name='message']", function () {
    	scrollToTheEnd();
	});

	setupInactiveTimer()
})

Template.threadPage.events({
	//sending message by ENTER key
	/*"keypress textarea[name='message']"(event, instance){
		if (event.keyCode == 13 && !event.shiftKey) {
			event.preventDefault()
			const body = event.target.value.trim()
			if (body.length > 0){
			    Meteor.call('threads.addMessage', Template.instance().threadId, Template.instance().inboxType, body)
			    event.target.value = ""
			    scrollToTheEnd()
			    keepFocus(event.target)		
			}
		}
	},*/
	"click .send-message-btn"(event, instance){
		const target = $("textarea[name='message']")[0]
		const body = target.value
		if (body.length > 0){
		    Meteor.call('threads.addMessage', Template.instance().threadId, Template.instance().inboxType, body)
		    $("textarea[name='message']")[0].value = ""
		    scrollToTheEnd()
		    keepFocus(target)			
		}
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
			return (author.type == 'shop') && (author.id == Meteor.user().shop)
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
	//sending message by ENTER key
	/*"keypress textarea[name='message']": function(e, instance){
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault()
			const body = e.target.value.trim()
			const data = Template.instance().data
			if (body.length > 0){
			    Meteor.call('threads.sendMessage', data.recpientType, data.recpientId, data.inboxType, body)
			    e.target.value = ""
			    $(`#${data.modalId}`).modal('toggle')				
			}
		}
	},*/
	"click .send-message-btn"(event, instance){
		const body = $("textarea[name='message']")[0].value
		const data = Template.instance().data
		if (body.length > 0){
		    Meteor.call('threads.sendMessage', data.recpientType, data.recpientId, data.inboxType, body)
		    $("textarea[name='message']")[0].value = ""
			$(`#${data.modalId}`).modal('toggle')			
		}
	},		
})