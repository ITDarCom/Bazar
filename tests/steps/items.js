module.exports = function(){

    this.Given(/^there are "([^"]*)" items$/, function (count) {    

        count = parseInt(count)

        if (count > 0){
            server.execute(function(count){
                return Meteor.call('generateItems', count);         
            }, count)
        }

    });

    this.Given(/^there are "([^"]*)" items under "([^"]*)" category$/, function (count, category) {    
        count = parseInt(count)

        var options = { category: category }

        if (count > 0){
            server.execute(function(count, options){
                return Meteor.call('generateItems', count, options);         
            }, count, options)
        }
    });

    this.Given(/^there are "([^"]*)" items in "([^"]*)" city$/, function (count, city) {    
        count = parseInt(count)

        var options = { city: city }

        if (count > 0){
            server.execute(function(count, options){
                return Meteor.call('generateItems', count, options);         
            }, count, options)
        }
    });


    this.Then(/^I should see a list of "([^"]*)" items$/, function (count) {    
        count = parseInt(count)     
        
        var doesExist = browser.waitForExist(".endless-list");
        expect(doesExist).toBe(true);

        const elements = browser.elements(".endless-list > .item-thumbnail");
        expect(elements.value.length).toEqual(count);
    });

    this.Given(/^I am on "([^"]*)" category page$/, function (category) {    
        var route = client.execute(function(category){
            return Router.go('categories.show', {category:category})
        }, category);
    });


    this.Then(/^I should be redirected to "([^"]*)" page$/, function (arg1) {    
        pending();
    });

    this.When(/^I scroll to the end of the page and wait a bit$/, function () {    
        client.execute(function(){
            window.scrollBy(0,10000)            
        });
        browser.pause(500);        
    });


    this.When(/^I type in the search box$/, function () {    
        pending();
    });


    this.Then(/^items should be ordered by date$/, function () {    
        pending();
    });    

}