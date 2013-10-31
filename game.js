var $Game = {
	init: function() {
		this.dice = new Dice();
		this.you = new Position("you");
		this.opp = new Position("opp");
		this.skill = new Skill();
		this.nextLvMod = 0;
	},

	dice: null,
	you: null,
	opp: null,
	skill: null,

	nextLvMod: 0,

	terminated: function() {
		return this.you.pos < this.opp.pos;
	},
};
