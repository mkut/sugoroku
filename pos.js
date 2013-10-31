function Position(player) {
	this.player = player;
	this.pos = 0;

	this.add = function(value) {
		this.pos += value;
		$Handler.positionUpdated.fire(this.player, this.pos);
	};

};
