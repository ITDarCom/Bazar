 Meteor.users.attachSchema(new SimpleSchema({
    'profile.hasShop' : {
        type: Boolean,
        defaultValue : false
    },
    'profile.shop' : {
        type: String
    },
    'profile.unreadPurchases': {
        type: Number,
        defaultValue: 0
    },
    phone:{
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
     lastSignIn: {
         type: Date,
         defaultvalue: new Date(),
         autoValue: function () {
             return new Date();
         }
     },
     registerdAt: {
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
