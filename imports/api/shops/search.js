import {SearchSource} from 'meteor/meteorhacks:search-source'

import {Shops} from './collection'

SearchSource.defineSource('shops', function(searchText, query) {
	var options = {sort: {isoScore: -1}, limit: 20};
	//Meteor._sleepForMs(200);

	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = { $or: [{title: regExp}, {description: regExp}],isHidden: false};
		Object.assign(selector, query)
		return Shops.find(selector, options).fetch();
	} else {
		return Shops.find({}, options).fetch();
	}
});

function buildRegExp(searchText) {
	var words = searchText.trim().split(/[ \-\:]+/);
	var exps = _.map(words, function(word) {
		return "(?=.*" + word + ")";
	});
	var fullExp = exps.join('') + ".+";
	return new RegExp(fullExp, "i");
}