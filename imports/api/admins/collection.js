/**
 * Created by kasem on 02.06.2016.
 */

import { Mongo } from 'meteor/mongo'

export const Admins = new Mongo.Collection('admins');

Admins.attachSchema(new SimpleSchema({
   AdminIds : {
       type: String,

   }

}));