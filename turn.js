var $Turn = {
	exec: function(ix) {
		move();

		if ($Position.terminated()) {
			console.log("score: " + $Position.you);
			alert("score: " + $Position.you);
			//$Game.initialize();
			return;
		}

		addDice();
		$Dice.decProhibition();
		prohibit();
		$Skill.levelUp();
		$Event.at($Position.you);
		$Dice.roll();

		function move() {
			var ds = $Dice.dices;
			for (var i = 0; i < ds.length; i++) {
				var d = ds[i];
				if (i == ix) {
					$Position.add($Position.OPPONENT, d);
				} else if (!$Dice.prohibited(d)) {
					$Position.add($Position.YOU, d);
				}
			}
		}
		function addDice() {
			var ds = $Dice.dices;
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
				$Dice.addDices(1);
			}
		}
		function prohibit() {
			var ds = $Dice.dices;
			var diceUsed = [undefined, false, false, false, false, false, false];
			for (var i = 0; i < ds.length; i++) {
				var d = ds[i];
				if (i != ix && !$Dice.prohibited(d)) {
					diceUsed[d] = true;
				}
			}
			for (var i = 1; i <= 6; i++) {
				if (diceUsed[i]) {
					$Dice.prohibit(i);
				}
			}
		}
	},
};
