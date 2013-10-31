var $DOM = {
	initialized: function() {
	},

	positionUpdated: function(player, value) {
		$("#pos-" + player).text(value);
	},

	diceRolled: function() {
		$("#dice-line").empty();
		for (var i = 0; i < $Game.dice.dices.length; i++) {
			var d = $Game.dice.dices[i];
			$("<div/>")
				.text(d)
				.attr("id", "dice-" + i)
				.addClass("dice")
				.addClass($Game.dice.prohibited(d) ? "dice-disabled" : "")
				.click(onClick(i))
				.appendTo($("#dice-line"));
		}
		$("<div/>")
			.addClass("clear")
			.appendTo($("#dice-line"));

		function onClick(i) {
			return function() {
				$Game.skill.selectDice(i);
			};
		}
	},
	diceUpdated: function(ix, value) {
		var dom = $("#dice-" + ix);
		dom.text(value);
		if ($Game.dice.prohibited(value)) {
			dom.addClass("dice-disabled");
		} else {
			dom.removeClass("dice-disabled");
		}
	},

	prohibitionUpdated: function() {
		for (var i = 1; i <= 6; i++) {
			$("#prohibit-" + i).text($Game.dice.prohibition[i]);
		}
	},

	skillStarted: function(skillId) {
		$("#skill-" + skillId).addClass("skill-activated");
	},
	skillFinished: function(skillId) {
		$("#skill-" + skillId).removeClass("skill-activated");
	},
	skillLevelUpdated: function(skillId, value) {
		$("#skill-" + skillId + " .skill-level").text("Lv " + value);
	},
};
