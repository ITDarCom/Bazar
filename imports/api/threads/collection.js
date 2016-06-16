import { Mongo } from 'meteor/mongo';
 
export const Threads = new Mongo.Collection('threads');

const MessageSchema = new SimpleSchema({
    body: {
        type: String,
        /*label: function(){
            return TAPi18n.__('body')
        },*/
    },
    "author.type" : { type: String },
    "author.id" : { type: String },
    createdAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }   
})

Threads.attachSchema(new SimpleSchema({
    messages: {
        type: [MessageSchema]
    },
    "participants.$.type" : { type: String },
    "participants.$.id" : { type: String },
    "participants.$.unread" : { type: Boolean },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            if (this.isUpdate) {
                this.unset(); // we should unset every change to this field
            }
        }
    },
    updatedAt: {
        type: Date
    }
}));

Threads.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedAt = Date.now();
});