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
    }
}));
