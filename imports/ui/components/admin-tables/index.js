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
            return Cities.find({},{sort: {createdAt: -1}});
        }
    },
    isCategory(){
        var route = Router.current().route.getName();        
        return route.match(/categories/)
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