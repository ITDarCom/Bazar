 Meteor.users.attachSchema(new SimpleSchema({
    'profile.hasShop' : {
        type: Boolean,
        defaultValue : false
    },
    'profile.shop' : {
        type: String
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
