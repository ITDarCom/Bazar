import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

Template.settingsPurchasesPage.onCreated(function(){
	Meteor.call('purchases.setReadStatus', true)
})