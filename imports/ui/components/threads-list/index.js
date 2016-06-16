import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import { Threads } from './../../../api/threads/collection'
import { Shops } from './../../../api/shops/collection'

import {recipientHelper} from './../../pages/inbox-thread/helpers'
import {recipientIsShopOwner} from './../../pages/inbox-thread/helpers'
import {getRecipient} from './../../pages/inbox-thread/helpers'

import './template.html'

Template.threadsList.onCreated(function(){

	this.inboxType = new ReactiveVar()

	//subscribing to the appropriate channel on server
	this.autorun(()=>{
		var route = Router.current().route.getName()
		var inboxType = route.match(/inbox.(\w+)/)[1] //personal or shop

		this.subscribe('inbox', { inboxType: inboxType})
		this.inboxType.set(inboxType)
	})
})

Template.threadsList.helpers({
	threads(){
		return Threads.find()
	}
})

Template.threadListItem.helpers({
	unread(){
		var route = Router.current().route.getName()
		var inboxType = route.match(/inbox.(\w+)/)[1] //personal or shop

		if (inboxType.match(/personal/)){
			return Template.instance().data.participants.find(p => {
				return (p.id == Meteor.userId()) && (p.type == 'user')
			}).unread			
		} else {
			return Template.instance().data.participants.find(p => {
				return (p.id == Meteor.user().profile.shop) && (p.type == 'shop')
			}).unread
		}

	},
	inbox(){
		return Router.current().route.getName().match(/inbox.(\w+)/)[1]
	},
	lastMessage(){
		const length = Template.instance().data.messages.length
		return Template.instance().data.messages[length-1]
	},
	recipient(){
		const route = Router.current().route.getName()
		const inboxType = route.match(/inbox.(\w+)/)[1]
		const thread = Template.instance().data
		return recipientHelper(thread, inboxType)
	},
	recipientIsShopOwner(){
		const route = Router.current().route.getName()
		const inboxType = route.match(/inbox.(\w+)/)[1]
		const thread = Template.instance().data		
		return recipientIsShopOwner(thread, inboxType)
	},
	avatar(){

		const route = Router.current().route.getName()
		const inboxType = route.match(/inbox.(\w+)/)[1]
		const thread = Template.instance().data		

		const recipient = getRecipient(thread, inboxType)

		if (recipient.type == 'user'){
			return Meteor.users.findOne(recipient.id).avatar
		} else {
			return Shops.findOne(recipient.id).logo
		}
	}			
})
