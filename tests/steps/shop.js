module.exports = function(){

    this.Given(/^there are "([^"]*)" shops$/, function (count) {
        count = parseInt(count)
        if (count > 0){
            server.execute(function(count){
                return Meteor.call('generateShops', count);         
            }, count)
        }
    });

    this.Given(/^there are "([^"]*)" shops titled "([^"]*)"$/, function (count, title) {    
        count = parseInt(count)
        var options = { title: title }
        if (count > 0){
            server.execute(function(count, options){
                return Meteor.call('generateShops', count, options);         
            }, count, options)
        }
    });        

	this.Then(/^I should see "([^"]*)"$/, function (text) {
		var doesExist = browser.waitForExist(".container");
		var actualText = browser.getText(".container");
		expect(actualText[0].indexOf(text)).not.toEqual(-1);
	});

	this.Then(/^I should see "([^"]*)" div$/, function (div) {
		var doesExist = browser.waitForExist(div);
		expect(doesExist).toBe(true);
	});	

	this.Then(/^I should not see "([^"]*)" div$/, function (div) {
		var doesNotExist = browser.waitForExist(div, undefined, true);
		expect(doesNotExist).toBe(true);
	});		

	this.Given(/^I on an item page I have created$/, function () {
		this.currentItem = server.execute(function(userId){
			return Meteor.call('createItemFromMyShop', userId);			
		}, this.currentUser.userId)

		client.execute(function(item){
  			Router.go('items.show', { itemId: item._id, shop: item.shop })
  		}, this.currentItem)
	});

}