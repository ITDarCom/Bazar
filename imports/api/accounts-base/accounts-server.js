
Accounts.onCreateUser(function (options, user) {
    user.registerdAt = new Date();
    return user;
});
Accounts.onLogin(function(){
    var userId = Meteor.userId();
    Meteor.users.upsert({_id: userId}, {$set: {lastSignIn: new Date()}});
});

