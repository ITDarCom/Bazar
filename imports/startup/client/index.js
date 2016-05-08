
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import "./routes"

import "./../../ui/layouts/global"

import "./../../ui/pages/home"
import "./../../ui/pages/shops-index"
import "./../../ui/pages/categories-show"

import "./../../ui/pages/settings-purchases"
import "./../../ui/pages/settings-orders"
import "./../../ui/pages/settings-sales"
import "./../../ui/pages/cart"

import "./../../ui/pages/shops-new"

import "./../../ui/pages/admin-categories"
import "./../../ui/pages/admin-users"

import "./../../ui/components/endless-list"
import "./../../ui/components/purchases-list"

Template.default.helpers({
  currentRoute() {
    return Router.current().route.getName()
  },
});