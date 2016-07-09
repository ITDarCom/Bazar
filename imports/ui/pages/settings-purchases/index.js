import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

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
    // do something
}
 
function goActive() {
	Meteor.call('purchases.setReadStatus', true)
    startTimer();
}

//end of js code to detect if user is active

Template.settingsPurchasesPage.onCreated(function(){
	Meteor.call('purchases.setReadStatus', true)
	setupInactiveTimer()
})