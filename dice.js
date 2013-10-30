var $Dice = {
	// number of dices
	_numDices: 2,
	numDices: function(value) {
		if (value === undefined) {
			return this._numDices;
		} else {
			this._numDices = Math.max(2, value);
		}
	},
	addDices: function(value) {
		this.numDices(this.numDices() + value);
	},

	// prohibition
	prohibition: [undefined, 0, 0, 0, 0, 0, 0],
	prohibited: function(d) {
		return this.prohibition[d] > 0;
	},
	prohibit: function(d) {
		this.prohibition[d] = d;
		this.prohibitionUpdated();
	},
	decProhibition: function() {
		for (var i = 1; i <= 6; i++) {
			this.prohibition[i] = Math.max(0, this.prohibition[i] - 1);
		}
		this.prohibitionUpdated();
	},
	incProhibition: function() {
		for (var i = 1; i <= 6; i++) {
			if (this.prohibition[i] > 0) {
				this.prohibition[i] += 1;
			}
		}
		this.prohibitionUpdated();
	},

	// roll dices
	dices: [],
	roll: function() {
		this.dices = [];
		for (var i = 0; i < this.numDices(); i++) {
			var x = Math.floor(Math.random() * 6) + 1;
			this.dices.push(x);
		}
		this.diceRolled();
	},
	inc: function(ix) {
		if (this.dices[ix] == 6) {
			return false;
		}
		this.dices[ix] += 1;
		this.diceUpdated(ix, this.dices[ix]);
		return true;
	},
	dec: function(ix) {
		if (this.dices[ix] == 1) {
			return false;
		}
		this.dices[ix] -= 1;
		this.diceUpdated(ix, this.dices[ix]);
		return true;
	},
	all: function(x) {
		for (var i = 0; i < this.dices.length; i++) {
			if (this.dices[i] != x) {
				return false;
			}
		}
		return true;
	},

	// DOM
	diceRolled: function() {
		$("#dice-line").empty();
		for (var i = 0; i < this.dices.length; i++) {
			var d = this.dices[i];
			$("<div/>")
				.text(d)
				.attr("id", "dice-" + i)
				.addClass("dice")
				.addClass(this.prohibited(d) ? "dice-disabled" : "")
				.click(onClick(i))
				.appendTo($("#dice-line"));
		}
		$("<div/>")
			.addClass("clear")
			.appendTo($("#dice-line"));

		function onClick(i) {
			return function() {
				$Skill.selectDice(i);
			};
		}
	},
	diceUpdated: function(ix, value) {
		var dom = $("#dice-" + ix);
		dom.text(value);
		if (this.prohibited(value)) {
			dom.addClass("dice-disabled");
		} else {
			dom.removeClass("dice-disabled");
		}
	},
	prohibitionUpdated: function() {
		for (var i = 1; i <= 6; i++) {
			$("#prohibit-" + i).text(this.prohibition[i]);
		}
	},
};
