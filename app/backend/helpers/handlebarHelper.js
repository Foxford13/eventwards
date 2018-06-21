'use strict';



function selectedHelper (_itemId, allSpeakers, options) {


	if (typeof allSpeakers === `undefined` || allSpeakers.length === 0 ) {

		return;
	}
	else if (typeof allSpeakers[0] === `undefined`) {

		const itemId = _itemId.toString();
		const foundOrganiser = ((allSpeakers._id ).toString() === itemId);
		return (foundOrganiser ? `selected` : ``);
	}
	else {
		const itemId = _itemId.toString();
		const foundSpeaker = allSpeakers.find(speaker => (speaker._id || speaker).toString() === itemId);

		return (foundSpeaker ? `selected` : ``);
	}
}




module.exports = {
	selectedHelper,

};
