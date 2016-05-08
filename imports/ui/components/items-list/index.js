import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import { Items } from './../../../api/items/collection'

import './template.html'

Template.itemsList.onCreated(function () {

    var instance = this

    //a reactive dictionary to store the state of our current list of articles
    instance.state = new ReactiveDict()
    instance.ready = new ReactiveVar()
    
    //query filters
    instance.category = new ReactiveVar()
    instance.shop = new ReactiveVar()
    instance.city = new ReactiveVar()

    //scroll listener to detect when we reach the end of page
    /*instance.listener = new ScrollListener(instance)
    window.addEventListener('scroll', instance.listener)*/

    //we reset our stored state whenever the route changes
    instance.autorun(function () {

        var route = Router.current().route.getName()
        var params = Router.current().params

        if (route.match(/categories/)){
        	instance.category.set(params.category)        	
        }

        var city = Session.get('selectedCity')
        if (city){
        	instance.city.set(city)
        }

        //default lastRequestSize and limit values
        var lastRequestSize = 0, limit = 5
        instance.state.set('lastRequestSize', lastRequestSize) //number of lastRequestSize items
        instance.state.set('limit', limit) //number of total displayed items

    })

    //we re-subscribe, when any of our query parameters or limit change
    instance.autorun(function () {

        var limit = instance.state.get('limit');
        
        var query = {
        	category: instance.category.get(),
        	shop: instance.shop.get(),
        	city: instance.city.get()
        }

        //subscribing using subscription manager
        //console.log('new query', query, limit)
        var subscription = instance.subscribe('items', query, limit)
        instance.ready.set(subscription.ready())

        if (subscription.ready()) {
            //increasing the actual number of displayed items
            instance.state.set('lastRequestSize', limit);
        }
    })

})

Template.itemsList.helpers({
	items(){
		return Items.find({})
	},
	listLoadingFirstTime(){
		return !Template.instance().ready.get() && 
			(Template.instance().state.get('lastRequestSize') == 0) //it is not a 'load more'
	}
})
