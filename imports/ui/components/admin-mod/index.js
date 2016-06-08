import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection'
import { Cities } from './../../../api/cities/collection'

Template.adminMod.helpers({
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

            return Categories.find({},{$sort: {createdAt: -1}});
        }
        else {
            return Cities.find({},{$sort: {createdAt: -1}});
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

Template.adminMod.events({
    "click .btn-delete": function (){

        var identifier = this.identifier;
        $("#" + identifier).remove();
        var route = Router.current().route.getName();
        if (route.match(/admin.categories/)){

            Meteor.call("deleteCategory",this._id);
        }
        else {
            Meteor.call("deleteCity",this._id);
        }



    }
});
