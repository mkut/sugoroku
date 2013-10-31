var $Handler = (function() {
	var handlers = [
		"initialized",
		"diceRolled",
		"diceUpdated",
		"prohibitionUpdated",
		"positionUpdated",
		"skillStarted",
		"skillFinished",
		"skillLevelUpdated",
	];

	var ret = {};
	for (var i = 0; i < handlers.length; i++) {
		var h = handlers[i];
		ret[h] = $.Callbacks();
	}
	ret.add = function(obj) {
		for (var i = 0; i < handlers.length; i++) {
			var h = handlers[i];
			if (obj[h]) {
				this[h].add(obj[h]);
			}
		}
	};
	return ret;
})(jQuery);
