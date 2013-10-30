var $Skill = {
	SKILL_NONE: 0,
	SKILL_PLUS: 1,
	SKILL_MINUS: 2,
	SKILL_MOVE: 3,
	SKILL_MOVE2: 4,
	skillMode: 0,
	incCount: 0,
	decCount: 0,

	skillLevel: [undefined, 0, 0, 0],
	levelUp: function() {
		for (var i = 1; i <= 3; i++) {
			this.skillLevel[i] += 1;
			this.skillLevelUpdated(i);
		}
	},
	addLevel: function(skillId, value) {
		this.skillLevel[skillId] = Math.max(0, this.skillLevel[skillId] + value);
		this.skillLevelUpdated(skillId);
	},

	load: function() {
		for (var i = 1; i <= 3; i++) {
			$("#skill-" + i).click($Skill.selectSkillFnc(i));
		}
	},

	selectSkillFnc: function(skillId) {
		return function() {
			$Skill.selectSkill(skillId);
		};
	},

	selectSkill: function(skillId) {
		if (this.skillLevel[skillId] > 0 && this.skillMode == this.SKILL_NONE) {
			this.skillMode = skillId;
			if (skillId == this.SKILL_PLUS) {
				this.incCount = this.skillLevel[skillId];
			} else {
				this.decCount = this.skillLevel[skillId];
			}
			this.skillLevel[skillId] -= 1;
			this.skillStarted(skillId);
			this.skillLevelUpdated(skillId);
			if ($Dice.all(6) && skillId == this.SKILL_PLUS) {
				this.skillMode = this.SKILL_NONE;
				this.skillFinished(skillId);
			} else if ($Dice.all(1) && (skillId == this.SKILL_MINUS || skillId == this.SKILL_MOVE)) {
				this.skillMode = this.SKILL_NONE;
				this.skillFinished(skillId);
			}
		} else if (skillId == this.SKILL_MINUS && this.skillMode == this.SKILL_MINUS) {
			this.skillMode = this.SKILL_NONE;
			this.skillFinished(skillId);
		}
	},
	selectDice: function(ix) {
		switch (this.skillMode) {
			case this.SKILL_NONE:
				$Turn.exec(ix);
				break;
			case this.SKILL_PLUS:
				var res = $Dice.inc(ix);
				if (res) {
					this.incCount -= 1;
				} else {
					// show msg
				}
				if (this.incCount == 0 || $Dice.all(6)) {
					this.skillMode = this.SKILL_NONE;
					this.skillFinished(this.SKILL_PLUS);
				}
				break;
			case this.SKILL_MINUS:
				var res = $Dice.dec(ix);
				if (res) {
					this.decCount -= 1;
				} else {
					// show msg
				}
				if (this.decCount == 0) {
					this.skillMode = this.SKILL_NONE;
					this.skillFinished(this.SKILL_MINUS);
				}
				break;
			case this.SKILL_MOVE:
				var res = $Dice.dec(ix);
				if (res) {
					this.decCount -= 1;
					this.incCount += 1;
				} else {
					// show msg
				}
				if (this.decCount == 0) {
					this.skillMode = this.SKILL_MOVE2;
				}
				break;
			case this.SKILL_MOVE2:
				var res = $Dice.inc(ix);
				if (res) {
					this.incCount -= 1;
				} else {
					// show msg
				}
				if (this.incCount == 0) {
					this.skillMode = this.SKILL_NONE;
					this.skillFinished(this.SKILL_MOVE);
				}
				break;
		}
	},

	// DOM
	skillStarted: function(skillId) {
		$("#skill-" + skillId).addClass("skill-activated");
	},
	skillFinished: function(skillId) {
		$("#skill-" + skillId).removeClass("skill-activated");
	},
	skillLevelUpdated: function(skillId, value) {
		if (value === undefined) {
			value = this.skillLevel[skillId];
		}
		$("#skill-" + skillId + " .skill-level").text("Lv " + value);
	}
};
