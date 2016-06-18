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
    unreadPersonalInbox : {
        type: Number,
        defaultValue: 0
    },
    unreadShopInbox: {
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
    }
}));
