Meteor.publish("userData", function () {
    console.log('userData', this.userId)
    if (this.userId) {
        return Meteor.users.find({_id: this.userId});
    } else {
    	return this.ready(); 
    }
});