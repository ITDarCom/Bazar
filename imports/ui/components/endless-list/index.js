import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'

import './template.html'
import {itemsCache} from './cache.js'

const endlessScrollInc = 8;

//we wrap this listener so we can use its reference un-register when templates are destroyed
function ScrollListener(instance) {

    return function (e) {
        var threshold, target = $("#loading-more-items");
        if (!target.length) return;

        threshold = $(window).scrollTop() + $(window).height() - target.height();

        if (target.offset().top <= threshold) {
            // increase limit by 6 and update it
            instance.state.set('limit', instance.cursor().count() + endlessScrollInc)
        }
    }
}

Template.endlessList.onCreated(function () {

    var instance = this

    //a reactive dictionary to store the state of the list
    instance.state = new ReactiveDict()
    instance.ready = new ReactiveVar()
    instance.query = new ReactiveVar()

    //reactive variables for query filters
    instance.category = new ReactiveVar()
    instance.shop = new ReactiveVar()
    instance.city = new ReactiveVar()

    //scroll listener to detect when we reach the end of page
    instance.listener = new ScrollListener(instance)
    window.addEventListener('scroll', instance.listener)

    instance.cursor = ()=> {
        const route = Router.current().route.getName()
        const query = this.query.get()
        //if (route.match(/shops.index/)){
        //    return Shops.find(query)
        //} else { return Items.find(query) }
        if (route.match(/shops.index/)) {

            return Shops.find(query)
        }
        else if (route.match(/favorites.index/)) {
              var user = Meteor.users.findOne({_id: Meteor.userId()});
                if (user) {

                    var favorites = user.favorites;
                    if (!favorites){

                        favorites = [];
                    }
                    return Items.find({_id: {$in: favorites}});
                }


        }
        else {
            return Items.find(query)
        }
    }

    //we reset our stored state whenever the route changes
    instance.autorun(function () {

        var route = Router.current().route.getName()
        var params = Router.current().params

        //if we are on a category page, we'll filter by category
        if (route.match(/categories.show/)) {
            instance.category.set(params.category)
        }

        //if a city is selected, we'll filter by city
        var city = Session.get('selectedCity')
        instance.city.set(city);

        //if we are on a shop page, we'll filter by shop
        if (route.match(/shops.show/)) {
            instance.shop.set(params.shop)
        }

        //default lastRequestSize and limit values
        var lastRequestSize = 0, limit = endlessScrollInc
        instance.state.set('lastRequestSize', lastRequestSize) //number of lastRequestSize items
        instance.state.set('limit', limit) //number of total displayed items
        //var subscriptionChannel = route.match(/shops.index/) ? 'shops' : 'items'
        var subscriptionChannel

        if (route.match(/shops.index/)) {

            subscriptionChannel = 'shops'
        }
        else if (route.match(/favorites.index/)) {

            subscriptionChannel = 'favoriteItems'
        }
        else {
            subscriptionChannel = 'items'
        }
        instance.state.set('subscriptionChannel', subscriptionChannel)

    });

    //we re-subscribe, when any of our query parameters or limit change
    instance.autorun(function () {

        var subscriptionChannel = instance.state.get('subscriptionChannel');

        var limit = instance.state.get('limit');

        var query = {
            category: instance.category.get(),
            shop: instance.shop.get(),
            city: instance.city.get()
        }
        //cleaning up 'undefined' keys
        for (var key in query) {
            if (!query[key]) delete query[key];
        }
        instance.query.set(query)

        //subscribing using subscription manager
        //console.log('new query', query, limit)
        var subscription = itemsCache.subscribe(subscriptionChannel, query, limit)
        instance.ready.set(subscription.ready())

        if (subscription.ready()) {
            //increasing the actual number of displayed items
            instance.state.set('lastRequestSize', limit);
        }
    });

    this.autorun(()=> {
        //search initialization
        var options = {
            keepHistory: 1000 * 60 * 5,
            localSearch: true
        };
        var fields = ['title', 'description'];

        const route = Router.current().route.getName();
        if (route.match(/shops.index/)) {
            this.itemsSearch = new SearchSource('shops', fields, options);
        } else {
            this.itemsSearch = new SearchSource('items', fields, options);
        }
    })

    //here we initiate a search request
    this.autorun(()=> {
        const searchText = Session.get('searchText')
        this.itemsSearch.search(searchText);
    })

    this.getSearchResults = ()=> {
        return this.itemsSearch.getData({
            transform: function (matchText, regExp) {
                return matchText.replace(regExp, "<b>$&</b>")
            },
            docTransform: function(doc){
                return _.extend(doc, {searchResult:true})
            },
            sort: {isoScore: -1}
        })
    }

})

Template.endlessList.onRendered(function () {
    //if we stored the lastScroll position, we'll scroll down to it
    if (Session.get('lastScrollPosition')) {
        if (Session.get('lastRoute') == Router.current().route.getName()) {
            window.scrollTo(0, Session.get('lastScrollPosition'))
            Tracker.nonreactive(function () {
                Session.set('lastScrollPosition', null)
            })
        }
    }
});

Template.endlessList.onDestroyed(function () {
    window.removeEventListener('scroll', Template.instance().listener)
})

//tracking what scroll position was the user at
Template.endlessList.events({
    'click .endless-list > .item-thumbnail a': function (event, instance) {
        Tracker.nonreactive(function () {
            Session.set('lastRoute', Router.current().route.getName())
        })
        Session.set('lastScrollPosition', window.scrollY)
    },
    'click .endless-list > .shop-thumbnail a': function (event, instance) {
        Tracker.nonreactive(function () {
            Session.set('lastRoute', Router.current().route.getName())
        })
        Session.set('lastScrollPosition', window.scrollY)
    },
})

Template.endlessList.helpers({
    showFilters(){
        //we hide filters on a shop page
        var route = Router.current().route.getName()
        if (route.match(/shops.show|favorites.index/)) return false; else return true;
    },
    template(){
        var channel = Template.instance().state.get('subscriptionChannel')
        var template = (channel == 'shops') ? 'shopThumbnail' : 'itemThumbnail'
        return template
    },
    items(){
        return Template.instance().cursor()
    },
    listLoadingFirstTime(){
        return !Template.instance().ready.get() &&
            (Template.instance().state.get('lastRequestSize') == 0) //it is not a 'load more'
    },
    hasMore: function () {
        var count = Template.instance().cursor().count()
        var lastRequestSize = Template.instance().state.get('lastRequestSize')
        return ((count >= lastRequestSize) && (count != 0));
    },
    noItems: function () {
        return Template.instance().ready.get() && (Template.instance().cursor().count() == 0)
    },
    searchMode: function () {
        var searchText = Session.get('searchText')
        return searchText && (searchText.length > 0)
    },
    searchItems: function () {
        return Template.instance().getSearchResults()
    },
    noResults: function () {
        const status = Template.instance().itemsSearch.getStatus()
        const results = Template.instance().getSearchResults()
        return (status.loaded) && (results.length == 0)
    },
    isSearching(){
        const status = Template.instance().itemsSearch.getStatus()
        if (status.loading) return true; else return false;
    },
    isEven(index){
        return !(index % 2)
    }
})
