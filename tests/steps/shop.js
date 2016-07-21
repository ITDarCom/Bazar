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

	this.Given(/^I am on "([^"]*)" shop page$/, function (shopTitle) {
		const shop = server.execute(function(shopTitle){
			return Meteor.call('getShop', shopTitle);
		}, shopTitle)

        const route = client.execute(function(shopId){
            Router.go('shops.show', {shop:shopId})
        }, shop._id);

	});            

	this.Then(/^I should see "([^"]*)"$/, function (text) {
		var doesExist = browser.waitForExist(".canvas");
		var actualText = browser.getText(".canvas");
		expect(actualText).toContain(text);
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
		}, this.currentUser._id)

		client.execute(function(item){
  			Router.go('items.show', { itemId: item._id, shop: item.shop })
  		}, this.currentItem)
	});

}