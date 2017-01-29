import { Shops } from './../../../api/shops/collection'

function getRecipient(thread){

	const author = thread.participants.find(p => {
		return p.isAnnouncer || ((p.id == Meteor.userId()) && (p.type == 'user')) ||
			((p.id == Meteor.user().shop) && (p.type == 'shop'))
	})

	const index = thread.participants.indexOf(author)
	const recipientIndex = index ? 0:1;
	return thread.participants[recipientIndex]
}

function recipientHelper(thread){
	const recipient = getRecipient(thread)

	if (recipient.type == 'user'){
		return Meteor.users.findOne(recipient.id)
	} else {
		return Shops.findOne(recipient.id)
	}
}

function recipientIsShopOwner(thread){
	const recipient = getRecipient(thread)
	return (recipient.type == 'shop')	
}

function bothAreUsers(thread){
	if (thread.participants[0].type == 'user' && thread.participants[1].type == 'user'){
		return true
	} else {
		return false
	}
}

export {bothAreUsers}
export {getRecipient}
export {recipientHelper}
export {recipientIsShopOwner}