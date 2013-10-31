var $Event = {
	at: function(n) {
		var currentLvMod = $Game.nextLvMod;
		$Game.nextLvMod = 0;
		$("#event-list").empty(); // TODO separate DOM manipulation
		var f = factor(n);
		for (var key in f) {
			var lv = f[key] + currentLvMod;
			var ev = Math.floor(Math.random() * 7);
			this.occur(ev, lv);
			$("<div/>")
				.addClass("event")
				.text(this.text(ev, lv))
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
	},

	occur: function(eventId, lv) {
		switch (eventId) {
			case 0:
				$Game.skill.addLevel(1, -lv);
				break;
			case 1:
				$Game.skill.addLevel(2, -lv);
				break;
			case 2:
				$Game.skill.addLevel(3, -lv);
				break;
			case 3:
				$Game.dice.addDices(-lv);
				break;
			case 4:
				$Game.dice.incProhibition();
				break;
			case 5:
				$Game.you.add(-lv);
				break;
			case 6:
				$Game.nextLvMod += lv;
				break;
		}
	},
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
