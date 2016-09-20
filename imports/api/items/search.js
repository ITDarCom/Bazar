import {SearchSource} from 'meteor/meteorhacks:search-source'

import {Items} from './collection'

SearchSource.defineSource('items', function(searchText, query) {

	var opts = {sort: {isoScore: -1}, limit: 20};

	//Meteor._sleepForMs(200);	

	if (searchText) {
		var regExp = buildRegExp(searchText);
		var selector = { $or: [{title: regExp}, {description: regExp}], isHidden: false };
		Object.assign(selector, query)
		return Items.find(selector, opts).fetch();
	} else {
		return Items.find({}, opts).fetch();
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