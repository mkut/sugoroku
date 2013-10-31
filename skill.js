var $Skill = {
	NONE: 0,
	PLUS: 1,
	MINUS: 2,
	MOVE: 3,
	MOVE2: 4,
};

function Skill() {
	this.skillLevel = [undefined, 0, 0, 0];

	this.skillMode = 0;
	this.incCount = 0;
	this.decCount = 0;

	this.levelUp = function() {
		for (var i = 1; i <= 3; i++) {
			this.skillLevel[i] += 1;
			$Handler.skillLevelUpdated.fire(i, this.skillLevel[i]);
		}
	};
	this.addLevel = function(skillId, value) {
		this.skillLevel[skillId] = Math.max(0, this.skillLevel[skillId] + value);
		$Handler.skillLevelUpdated.fire(skillId, this.skillLevel[skillId]);
	};

	this.onLoad = function() {
		for (var i = 1; i <= 3; i++) {
			$("#skill-" + i).click($Game.skill.selectSkillFnc(i));
		}
	};

	this.selectSkillFnc = function(skillId) {
		return function() {
			$Game.skill.selectSkill(skillId);
		};
	};

	this.selectSkill = function(skillId) {
		if (this.skillLevel[skillId] > 0 && this.skillMode == $Skill.NONE) {
			this.skillMode = skillId;
			if (skillId == $Skill.PLUS) {
				this.incCount = this.skillLevel[skillId];
			} else {
				this.decCount = this.skillLevel[skillId];
			}
			this.skillLevel[skillId] -= 1;
			$Handler.skillStarted.fire(skillId);
			$Handler.skillLevelUpdated.fire(skillId, this.skillLevel[skillId]);
			if ($Game.dice.all(6) && skillId == $Skill.PLUS) {
				this.skillMode = $Skill.NONE;
				$Handler.skillFinished.fire(skillId);
			} else if ($Game.dice.all(1) && (skillId == $Skill.MINUS || skillId == $Skill.MOVE)) {
				this.skillMode = $Skill.NONE;
				$Handler.skillFinished.fire(skillId);
			}
		} else if (skillId == $Skill.MINUS && this.skillMode == $Skill.MINUS) {
			this.skillMode = $Skill.NONE;
			$Handler.skillFinished.fire(skillId);
		}
	};
	this.selectDice = function(ix) {
		switch (this.skillMode) {
			case $Skill.NONE:
				$Turn.exec(ix);
				break;
			case $Skill.PLUS:
				var res = $Game.dice.inc(ix);
				if (res) {
					this.incCount -= 1;
				} else {
					// show msg
				}
				if (this.incCount == 0 || $Game.dice.all(6)) {
					this.skillMode = $Skill.NONE;
					$Handler.skillFinished.fire($Skill.PLUS);
				}
				break;
			case $Skill.MINUS:
				var res = $Game.dice.dec(ix);
				if (res) {
					this.decCount -= 1;
				} else {
					// show msg
				}
				if (this.decCount == 0 || $Game.dice.all(1)) {
					this.skillMode = $Skill.NONE;
					$Handler.skillFinished.fire($Skill.MINUS);
				}
				break;
			case $Skill.MOVE:
				var res = $Game.dice.dec(ix);
				if (res) {
					this.decCount -= 1;
					this.incCount += 1;
				} else {
					// show msg
				}
				if (this.decCount == 0 || $Game.dice.all(1)) {
					this.skillMode = $Skill.MOVE2;
				}
				break;
			case $Skill.MOVE2:
				var res = $Game.dice.inc(ix);
				if (res) {
					this.incCount -= 1;
				} else {
					// show msg
				}
				if (this.incCount == 0) {
					this.skillMode = $Skill.NONE;
					$Handler.skillFinished.fire($Skill.MOVE);
				}
				break;
		}
	};
};
