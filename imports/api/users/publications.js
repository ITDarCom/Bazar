Meteor.publish("userData", function () {
	//Meteor._sleepForMs(200);	
    if (this.userId) {
        return Meteor.users.find({_id: this.userId});
    } else {
    	return this.ready(); 
    }
});

Meteor.publish("adminData", function () {
    return Meteor.users.find({isAdmin: true});
});