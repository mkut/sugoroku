var $Turn = {
	exec: function(ix) {
		move();

		if ($Game.terminated()) {
			console.log("score: " + $Game.you.pos);
			alert("score: " + $Game.you.pos);
			$Game.init();
			return;
		}

		addDice();
		$Game.dice.decProhibition();
		prohibit();
		$Game.skill.levelUp();
		$Event.at($Game.you.pos);
		$Game.dice.roll();

		function move() {
			var ds = $Game.dice.dices;
			for (var i = 0; i < ds.length; i++) {
				var d = ds[i];
				if (i == ix) {
					$Game.opp.add(d);
				} else if (!$Game.dice.prohibited(d)) {
					$Game.you.add(d);
				}
			}
		}
		function addDice() {
			var ds = $Game.dice.dices;
			var matching = undefined;
			for (var i = 0; i < ds.length; i++) {
				var d = ds[i];
				if (i != ix) {
					if (matching === undefined) {
						matching = d;
					} else if (matching != d) {
						matching = false;
					}
				}
			}
			if (matching != false) {
				$Game.dice.addDices(1);
			}
		}
		function prohibit() {
			var ds = $Game.dice.dices;
			var diceUsed = [undefined, false, false, false, false, false, false];
			for (var i = 0; i < ds.length; i++) {
				var d = ds[i];
				if (i != ix && !$Game.dice.prohibited(d)) {
					diceUsed[d] = true;
				}
			}
			for (var i = 1; i <= 6; i++) {
				if (diceUsed[i]) {
					$Game.dice.prohibit(i);
				}
			}
		}
	},
};
