import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection'
import { Cities } from './../../../api/cities/collection'

Template.adminTables.helpers({
    formCollection(){
        var route = Router.current().route.getName();
        if (route.match(/admin.categories/)){

            return Categories;
        }
        else {
           return Cities;
        }

    },
    components(){
        var route = Router.current().route.getName();
        if (route.match(/admin.categories/)){
            return Categories.find({},{sort: {order: 1}});
        }
        else {
            return Cities.find({},{sort: {createdAt: -1}});
        }
    },
    method(){
        var route = Router.current().route.getName();
        if (route.match(/admin.categories/)){

            return "category.insert";
        }
        else {
            return "city.insert";
        }
    }

});

Template.adminTables.events({
    "click .btn-delete": function (){

        //var identifier = this.identifier;
        //$("#" + identifier).remove();
        var route = Router.current().route.getName();
        if (route.match(/admin.categories/)){
            if (confirm(TAPi18n.__('deleteCategory')) == true) {
                Meteor.call("category.delete",this._id);
            }
        }
        else {
            if (confirm(TAPi18n.__('deleteCity')) == true) {
                Meteor.call("city.delete",this._id);
            }

        }
    }
});

Template.categotyOrder.events({
    "click .order-up-btn":function () {
        Meteor.call("categoryOrder.up",this.data.identifier)
    },
    "click .order-down-btn":function () {
        Meteor.call("categoryOrder.down",this.data.identifier)
    }
})