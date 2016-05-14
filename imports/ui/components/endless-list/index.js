import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'

import './template.html'

Template.endlessList.onCreated(function () {

    var instance = this

    //a reactive dictionary to store the state of the list
    instance.state = new ReactiveDict()
    instance.ready = new ReactiveVar()
    
    //reactive variables for query filters
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

        //if we are on a category page, we'll filter by category
        if (route.match(/categories.show/)){
        	instance.category.set(params.category)        	
        }

        //if a city is selected, we'll filter by city
        var city = Session.get('selectedCity')
        if (city){
        	instance.city.set(city)
        }

        //if we are on a shop page, we'll filter by shop
        if (route.match(/shops.show/)){
            instance.shop.set(params.shop)
        }

        //default lastRequestSize and limit values
        var lastRequestSize = 0, limit = 5
        instance.state.set('lastRequestSize', lastRequestSize) //number of lastRequestSize items
        instance.state.set('limit', limit) //number of total displayed items
        var subscriptionChannel = route.match(/shops.index/) ? 'shops' : 'items'
        instance.state.set('subscriptionChannel', subscriptionChannel)

    })

    //we re-subscribe, when any of our query parameters or limit change
    instance.autorun(function () {

        var subscriptionChannel = instance.state.get('subscriptionChannel');

        var limit = instance.state.get('limit');
        
        var query = {
        	category: instance.category.get(),
        	shop: instance.shop.get(),
        	city: instance.city.get()
        }

        //subscribing using subscription manager
        //console.log('new query', query, limit)
        var subscription = instance.subscribe(subscriptionChannel, query, limit)
        instance.ready.set(subscription.ready())

        if (subscription.ready()) {
            //increasing the actual number of displayed items
            instance.state.set('lastRequestSize', limit);
        }
    })

})

Template.endlessList.helpers({
    showFilters(){
        //we hide filters on a shop page
        var route = Router.current().route.getName()
        if (route.match(/shops.show/)) return false; else return true;
    },
    template(){
        var channel = Template.instance().state.get('subscriptionChannel')
        var template = (channel == 'shops') ? 'shopMiniView' : 'itemMiniView'
        return template
    },
	items(){
        var channel = Template.instance().state.get('subscriptionChannel')
        var Collection = (channel == 'shops') ? Shops : Items

        if (channel == 'shops'){
            return Shops.find({})            
        } else {
            return Items.find({})
        }
	},
	listLoadingFirstTime(){
		return !Template.instance().ready.get() && 
			(Template.instance().state.get('lastRequestSize') == 0) //it is not a 'load more'
	}
})
