$(function() {
	$(document).ready(function() {
		$Game.init();
		$Game.skill.onLoad();

		$Handler.add($DOM);

		$Game.dice.roll();
	});
});
