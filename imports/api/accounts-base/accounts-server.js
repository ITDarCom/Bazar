
Accounts.onCreateUser(function (options, user) {
    var Admins = ["Kasem", "Al-amjad", "Bazar"]
    if (_.contains(Admins, user.username)) {
        user.isAdmin = true;
    }
    else {
        user.isAdmin = false;
    }
    user.registerdAt = new Date();
    return user;
});
Accounts.onLogin(function(){
    var userId = Meteor.userId();
 Meteor.call('user.setLastSingnin',userId)
});

