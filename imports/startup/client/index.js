import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import "./routes"

import "./../../ui/layouts/global"

Template.default.helpers({
  currentRoute() {
    return Router.current().route.getName()
  },
});

/*import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});


Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/