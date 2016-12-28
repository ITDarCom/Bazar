import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection'
import { Cities } from './../../../api/cities/collection'

Template.adminTables.helpers({

    components(){
        var route = Router.current().route.getName();
        if (route.match(/admin.categories/)){
            return Categories.find({},{sort: {order: 1}});
        }
        else {
            return Cities.find({},{sort: {order: 1}});
        }
    },
    isCategory(){
        var route = Router.current().route.getName();        
        return route.match(/categories/)
    }


});

Template.adminTables.events({
    "click .btn-delete": function (){

        var self = this

        //var identifier = this.identifier;
        //$("#" + identifier).remove();
        var route = Router.current().route.getName();
        if (route.match(/admin.categories/)){

            Meteor.call("category.canDelete",this._id, function(err, result){
                if (err){
                    throw err
                } else if (result){
                    if (confirm(TAPi18n.__('deleteCategory')) == true) {
                        Meteor.call("category.delete",this._id);
                    }
                } else if (!result){
                    alert(TAPi18n.__('cannotDeleteCategory'))
                }
            })            
        }
        else {
            Meteor.call("city.canDelete",this._id, function(err, result){
                if (err){
                    throw err
                } else if (result){
                    if (confirm(TAPi18n.__('deleteCity')) == true) {
                        Meteor.call("city.delete", self._id);
                    }
                } else if (!result){
                    alert(TAPi18n.__('cannotDeleteCity'))
                }
            })
        }
    }
});

Template.categotyOrder.events({
    "click .order-up-btn":function () {
        var method
        const route = Router.current().route.getName();
        if (route.match(/admin.categories/)){
            method = 'categoryOrder';
        } else {
           method = 'cityOrder';
        }

        Meteor.call(method + ".up",this.data.identifier)
    },
    "click .order-down-btn":function () {
        var method
        const route = Router.current().route.getName();
        if (route.match(/admin.categories/)){
            method = 'categoryOrder';
        } else {
           method = 'cityOrder';
        }

        Meteor.call(method + ".down",this.data.identifier)
    }
})

Template.insertCategoryForm.helpers({
    formCollection(){
        const route = Router.current().route.getName();
        if (route.match(/admin.categories/)){
            return Categories;
        } else {
           return Cities;
        }
    },
    method(){
        const route = Router.current().route.getName();
        if (route.match(/edit/)){
            return "category.update";
        } else if (route.match(/categories/)) {
            return "category.insert";
        } else {
            return "city.insert";
        }
    },    
    doc(){
        return Categories.findOne(Router.current().params.categoryId)
    },
    formType(){
        const route = Router.current().route.getName();
        if (route.match(/edit/)){
            return "method-update"
        } else {
            return "method"
        }
    }    
})