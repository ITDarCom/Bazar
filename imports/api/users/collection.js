 Meteor.users.attachSchema(new SimpleSchema({
    'hasShop' : {
        type: Boolean,
        defaultValue : false
    },
    'shop' : {
        type: String
    },
    'avatar':{
        type: String,
    },
    'unreadPurchases': {
        type: Number,
        defaultValue: 0
    },
    'pendingPurchases': {
        type: Number,
        defaultValue: 0
    },
    'unreadInbox' : {
        type: Number,
        defaultValue: 0
    },
    'totalPurchases': {
        type: Number,
        defaultValue: 0
    },       
    'phone':{
        type: String,
        optional:true
    },
    'favorites' : {
        type :[String],
        defaultValue: [],
        minCount: 0
    },
     'isAdmin': {
         type :boolean,
         defaultValue:false,

     },
     'blocked': {
         type :boolean,
         defaultValue:false
     },
     'lastSignIn': {
         type: Date,
         defaultvalue: new Date(),
         autoValue: function () {
             return new Date();
         }
     },
     'registerdAt': {
         type: Date,
         autoValue: function () {
             if (this.isInsert) {
                 return new Date();
             }
             else {
                 this.unset();
             }
         }
     }
}));
