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

	//subscribing to the appropriate channel on server
	this.autorun(()=>{
		this.subscribe('inbox')
	})
})

Template.threadsList.helpers({
	threads(){
		return Threads.find()
	}
})

Template.threadListItem.helpers({
	unread(){

		return Template.instance().data.participants.find(p => {
			return ((p.id == Meteor.userId()) && (p.type == 'user')) ||
				((p.id == Meteor.user().shop) && (p.type == 'shop'))
		}).unread			

	},
	lastMessage(){
		const length = Template.instance().data.messages.length
		return Template.instance().data.messages[length-1]
	},
	recipient(){
		const thread = Template.instance().data
		return recipientHelper(thread)
	},
	recipientIsShopOwner(){
		const thread = Template.instance().data		
		return recipientIsShopOwner(thread)
	},
	avatar(){

		const thread = Template.instance().data		

		const recipient = getRecipient(thread)

		if (recipient.type == 'user'){
			return Meteor.users.findOne(recipient.id).avatar
		} else {
			return Shops.findOne(recipient.id).logo.url
		}
	}			
})
