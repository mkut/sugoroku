$(function() {
	var numDice = 2;
	var posPlayer = 0;
	var posOpponent = 0;
	var dices = [];
	var forbidden = [undefined, 0, 0, 0, 0, 0, 0];
	var skills = [0, 0, 0];
	var nextLevel = 0;
	var state = -1;
	var skillPlusRem = 0;
	var skillMinRem = 0;
	var numTurn = 0;
	var preDices = [];

	function updateDice(i) {
		var dom = $("#dice-" + i);
		dom.text(dices[i]);
		if (forbidden[dices[i]]) {
			dom.addClass("dice-disabled");
		} else {
			dom.removeClass("dice-disabled");
		}
	}

	function turn(ix) {
		var used = [undefined, false, false, false, false, false, false];
		var same = undefined;
		for (var i = 0; i < dices.length; i++) {
			if (i == ix) {
				posOpponent += dices[i];
			} else {
				if (same == undefined) {
					same = dices[i];
				} else if (same != false && same != dices[i]) {
					same = false;
				}
				if (forbidden[dices[i]] <= 0) {
					posPlayer += dices[i];
					used[dices[i]] = true;
				} else {
					posOpponent += 1;
				}
			}
		}
		if (posPlayer < posOpponent) {
			console.log("score: " + posPlayer);
			return;
		}
		for (var i = 1; i <= 6; i++) {
			if (used[i]) {
				forbidden[i] = i;
			}
		}
		if (same != false) {
			numDice += 1;
		}
		for (var i = 0; i < 3; i++) {
			skills[i] += 1;
		}
		eventRoll(posPlayer);
		for (var i = 1; i <= 6; i++) {
			if (forbidden[i] > 0) {
				forbidden[i] -= 1;
			}
		}

		for (var i = 1; i <= 6; i++) {
			$("#forbid-" + i).text(forbidden[i]);
		}
		for (var i = 0; i < 3; i++) {
			$("#skill-" + i + " .skill-level").text("Lv " + skills[i]);
		}
		$("#position").text(posPlayer);
		$("#opponent").text(posOpponent);
		$("#dice-line").empty();
		dices = [];
		diceRoll();
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

	function eventRoll(n) {
		var currentLevel = nextLevel;
		nextLevel = 0;
		$("#event-list").empty();
		var f = factor(n);
		for (var key in f) {
			var lv = f[key] + currentLevel;
			var ev = Math.floor(Math.random() * 7);
			$("<div/>")
				.addClass("event")
				.text(event(ev, lv))
				.appendTo($("#event-list"));
		}

		function event(ev, lv) {
			switch (ev) {
				case 0:
					skills[0] = Math.max(0, skills[0] - lv);
					return "Manip+ level down [" + lv + "]";
					break;
				case 1:
					skills[1] = Math.max(0, skills[1] - lv);
					return "Manip- level down [" + lv + "]";
					break;
				case 2:
					skills[2] = Math.max(0, skills[2] - lv);
					return "Move level down [" + lv + "]";
					break;
				case 3:
					numDice = Math.max(2, numDice - lv);
					return "Dice decreased [" + lv + "]";
					break;
				case 4:
					for (var i = 1; i <= 6; i++) {
						if (forbidden[i] > 0) {
							forbidden[i] += lv;
						}
					}
					return "Extended prohibition [" + lv + "]";
					break;
				case 5:
					posPlayer -= lv;
					return "Moved back [" + lv + "]";
					break;
				case 6:
					nextLevel += lv;
					return "Event level increased (next turn) [" + lv + "]";
					break;
			}
		}
	}

	function diceRoll() {
		numTurn += 1;
		for (var i = 0; i < numDice; i++) {
			var x = Math.floor(Math.random() * 6) + 1;
			dices.push(x);
			$("<div/>")
				.text(x)
				.attr("id", "dice-" + i)
				.addClass("dice")
				.addClass(forbidden[x] ? "dice-disabled" : "")
				.click(diceClick(i))
				.appendTo($("#dice-line"));
		}
		$("<div/>")
			.addClass("clear")
			.appendTo($("#dice-line"));

		var logText = "Turn " + numTurn + ": [Dice] ";
		for (var i = 0; i < dices.length; i++) {
			if (i > 0) {
				logText += ", ";
			}
			logText += dices[i];
		}
		$("<div/>")
			.text(logText)
			.prependTo("#log")
	}

	function diceClick(ix) {
		return function() {
			if (state == -1) {
				turn(ix);
			} else if (state == 0) {
				if (dices[ix] == 6) {
					console.log("max is 6");
				} else {
					dices[ix] += 1;
					updateDice(ix);
					skillPlusRem -= 1;
				}
				if (skillPlusRem <= 0 || checkAll(6)) {
					finishSkill(0);
				}
			} else if (state == 1) {
				if (dices[ix] == 1) {
					console.log("min is 1");
				} else {
					dices[ix] -= 1;
					updateDice(ix);
					skillMinusRem -= 1;
				}
				if (skillMinusRem <= 0 || checkAll(1)) {
					finishSkill(1);
				}
			} else if (state == 2) {
				if (skillMinusRem > 0) {
					if (dices[ix] == 1) {
						console.log("min is 1");
					} else {
						dices[ix] -= 1;
						updateDice(ix);
						skillMinusRem -= 1;
						skillPlusRem += 1;
					}
				} else {
					if (dices[ix] == 6) {
						console.log("max is 6");
					} else {
						dices[ix] += 1;
						updateDice(ix);
						skillPlusRem -= 1;
					}
				}
				if (skillMinusRem > 0 && checkAll(1)) {
					skillMinusRem = 0;
				}
				if (skillMinusRem <= 0 && skillPlusRem <= 0) {
					finishSkill(2);
				}
			}
		};
	}
	function checkAll(d) {
		for (var i = 0; i < dices.length; i++) {
			if (dices[i] != d) {
				return false;
			}
		}
		return true;
	}
	function finishSkill(skillId) {
		state = -1;
		$("#skill-" + skillId).removeClass("skill-activated");
		var logText = "Turn " + numTurn + ": [Skill " + skillId + "] " + preDices + " => " + dices;
		$("<div/>").text(logText).prependTo("#log");
	}

	$("#skill-0").click(function() {
		if (skills[0] > 0 && state == -1) {
			state = 0;
			skillPlusRem = skills[0];
			skills[0] -= 1;
			$("#skill-0 .skill-level")
				.text("Lv " + skills[0])
			$("#skill-0").addClass("skill-activated");
			preDices = dices.slice(0);
			if (checkAll(6)) {
				finishSkill(0);
			}
		}
	});
	$("#skill-1").click(function() {
		if (skills[1] > 0 && state == -1) {
			state = 1;
			skillMinusRem = skills[1];
			skills[1] -= 1;
			$("#skill-1 .skill-level").text("Lv " + skills[1]);
			$("#skill-1").addClass("skill-activated");
			preDices = dices.slice(0);
			if (checkAll(1)) {
				finishSkill(1);
			}
		} else if (state == 1) {
			finishSkill(1);
		}
	});
	$("#skill-2").click(function() {
		if (skills[2] > 0 && state == -1) {
			state = 2;
			skillMinusRem = skills[2];
			skills[2] -= 1;
			$("#skill-2 .skill-level").text("Lv " + skills[2]);
			$("#skill-2").addClass("skill-activated");
			preDices = dices.slice(0);
			if (checkAll(1)) {
				finishSkill(2);
			}
		}
	});

	diceRoll();
});
