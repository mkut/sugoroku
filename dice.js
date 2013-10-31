function Dice() {
	// number of dices
	this._numDices = 2;
	this.numDices = function(value) {
		if (value === undefined) {
			return this._numDices;
		} else {
			this._numDices = Math.max(2, value);
		}
	};
	this.addDices = function(value) {
		this.numDices(this.numDices() + value);
	};

	// prohibition
	this.prohibition = [undefined, 0, 0, 0, 0, 0, 0];
	this.prohibited = function(d) {
		return this.prohibition[d] > 0;
	};
	this.prohibit = function(d) {
		this.prohibition[d] = d;
		$Handler.prohibitionUpdated.fire();
	};
	this.decProhibition = function() {
		for (var i = 1; i <= 6; i++) {
			this.prohibition[i] = Math.max(0, this.prohibition[i] - 1);
		}
		$Handler.prohibitionUpdated.fire();
	};
	this.incProhibition = function(n) {
		for (var i = 1; i <= 6; i++) {
			if (this.prohibition[i] > 0) {
				this.prohibition[i] += n;
			}
		}
		$Handler.prohibitionUpdated.fire();
	};

	// roll dices
	this.dices = [];
	this.roll = function() {
		this.dices = [];
		for (var i = 0; i < this.numDices(); i++) {
			var x = Math.floor(Math.random() * 6) + 1;
			this.dices.push(x);
		}
		$Handler.diceRolled.fire();
	};
	this.inc = function(ix) {
		if (this.dices[ix] == 6) {
			return false;
		}
		this.dices[ix] += 1;
		$Handler.diceUpdated.fire(ix, this.dices[ix]);
		return true;
	};
	this.dec = function(ix) {
		if (this.dices[ix] == 1) {
			return false;
		}
		this.dices[ix] -= 1;
		$Handler.diceUpdated.fire(ix, this.dices[ix]);
		return true;
	};
	this.all = function(x) {
		for (var i = 0; i < this.dices.length; i++) {
			if (this.dices[i] != x) {
				return false;
			}
		}
		return true;
	};
};
