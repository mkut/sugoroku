var $Position = {
	YOU: 0,
	OPPONENT: 1,
	you: 0,
	opp: 0,

	add: function(player, value) {
		if (player == this.YOU) {
			this.you += value;
		} else if (player == this.OPPONENT) {
			this.opp += value;
		}
		this.positionUpdated(player);
	},

	terminated: function() {
		return this.you < this.opp;
	},

	// DOM
	positionUpdated: function(player, value) {
		if (player == this.YOU) {
			if (value === undefined) {
				value = this.you;
			}
			$("#pos-you").text(value);
		} else if (player == this.OPPONENT) {
			if (value === undefined) {
				value = this.opp;
			}
			$("#pos-opp").text(value);
		}
	},
};
