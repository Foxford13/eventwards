'use strict';

/*
* MODEL: Event
*/

const mongoose = require(`mongoose`);
const socialMessages = require(`./socialMessages`);

/*
*
*/
const sponsorSchema = new mongoose.Schema({
	name: { type: String, default: null },
	sponsorLogoUrl: { type: String, default: null },
	sponsorPageUrl: { type: String, default: null },
}, {
	_id: false,
});

/*
* something useful
*/
const eventSchema = new mongoose.Schema({
	name: { type: String, default: null, text: true },
	email: { type: String, default: null },
	eventDate: {
		start: { type: Date, default: null },
		finish: { type: Date, default: null },
	},
	imageFileName: { type: String, default: null },
	quote: { type: String, default: null },
	hashtagOrganiser: { type: String, defaualt: null },
	organiserLogoUrl: { type: String, defaualt: null },
	titoId: { type: String, defaualt: null },
	backgroundImageUrl: { type: String, default: null },
	_organiser: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
	_speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	_videos: [{ type: mongoose.Schema.Types.ObjectId, ref: `Video` }],
	_articles: [{ type: mongoose.Schema.Types.ObjectId, ref: `Article` }],
	_sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: `Session` }],
	partners: {
		platinumSponsors: [ sponsorSchema ],
		goldSponsors: [ sponsorSchema ],
		silverSponsors: [ sponsorSchema ],
		bronzeSponsors: [ sponsorSchema ],
		media: [ sponsorSchema ],
	},
	location: { type: String, default: null },
	address: { type: String, default: null },
	about: { type: String, default: null },
	takeaways: [{ type: String }],
	titoId: { type: String, default: null },
	social: {
		messages: socialMessages,
	},
	_hubs: [{ type: mongoose.Schema.Types.ObjectId, ref: `Hub` }],
	_tags: [{ type: mongoose.Schema.Types.ObjectId, ref: `Tag` }],
	deleted: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },
});

eventSchema.index({ name: `text`, _speaker: `text`, _organiser: `text`, location: `text`,
	_videos: `text`, _tags: `text`, _hubs: `text`, _articles: `text` });

module.exports = mongoose.model(`Event`, eventSchema, `event`);
