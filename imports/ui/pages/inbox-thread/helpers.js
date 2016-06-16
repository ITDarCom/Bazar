import { Shops } from './../../../api/shops/collection'

function getRecipient(thread, inboxType){
	var author
	if (inboxType.match(/personal/)){
		author = _.findWhere(thread.participants, { type:'user', id: Meteor.userId() })
	} else {
		author = _.findWhere(thread.participants, { type:'shop', id: Meteor.user().profile.shop })
	}
	const index = thread.participants.indexOf(author)
	const recipientIndex = index ? 0:1;
	return thread.participants[recipientIndex]
}

function recipientHelper(thread, inboxType){
	const recipient = getRecipient(thread, inboxType)

	if (recipient.type == 'user'){
		return Meteor.users.findOne(recipient.id)
	} else {
		return Shops.findOne(recipient.id)
	}
}

function recipientIsShopOwner(thread, inboxType){
	const recipient = getRecipient(thread, inboxType)
	return (recipient.type == 'shop')	
}
export {getRecipient}
export {recipientHelper}
export {recipientIsShopOwner}