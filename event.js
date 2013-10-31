var $Event = {
	at: function(n) {
		var currentLvMod = $Game.nextLvMod;
		$Game.nextLvMod = 0;
		$("#event-list").empty(); // TODO separate DOM manipulation
		var f = factor(n);
		for (var key in f) {
			var lv = f[key] + currentLvMod;
			var ev = Math.floor(Math.random() * this.allEvent.length);
			this.allEvent[ev].effect(lv);
			$("<div/>")
				.addClass("event")
				.text(textFormat(this.allEvent[ev].text, lv))
				.appendTo($("#event-list"));
		}

		function factor(n) {
			var ret = {};
			while (n % 2 == 0) {
				ret[2] = 2 in ret ? ret[2] + 1 : 1;
				n = Math.round(n/2);
			}
			var p = 3;
			while (n > 1) {
				if (p * p > n) {
					ret[n] = 1;
					break;
				}
				if (n % p == 0) {
					ret[p] = p in ret ? ret[p] + 1 : 1;
					n = Math.round(n/p);
				} else {
					p += 2;
				}
			}
			return ret;
		}

		function textFormat(text, lv) {
			return text + " [" + lv + "]";
		}
	},

	allEvent: [
		{effect: function(lv) {
				for (var i = 1; i <= 3; i++) {
					$Game.skill.addLevel(i, -lv);
				}
			}, text: "Skill level decreased"},
		{effect: function(lv) {$Game.dice.addDices(-lv);}, text: "Dice decreased"},
		{effect: function(lv) {$Game.dice.incProhibition(lv);}, text: "Extended prohibition"},
		{effect: function(lv) {$Game.you.add(-(lv * lv));}, text: "Moved back"},
		{effect: function(lv) {$Game.nextLvMod += lv;}, text: "Event level increased (next turn)"},
	],

	text: function(eventId, lv) {
		switch (eventId) {
			case 0:
				return "Manip+ level down [" + lv + "]";
			case 1:
				return "Manip- level down [" + lv + "]";
			case 2:
				return "Move level down [" + lv + "]";
			case 3:
				return "Dice decreased [" + lv + "]";
			case 4:
				return "Extended prohibition [" + lv + "]";
			case 5:
				return "Moved back [" + lv + "]";
			case 6:
				return "Event level increased (next turn) [" + lv + "]";
		}
	},
};
