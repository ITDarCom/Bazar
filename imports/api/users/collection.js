 Meteor.users.attachSchema(new SimpleSchema({
    'profile.hasShop' : {
        type: Boolean,
        defaultValue : false
    },
    'profile.shop' : {
        type: String
    }
}));