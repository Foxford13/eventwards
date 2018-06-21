'use strict';

/*
 * MODEL: Video
 */

const mongoose = require(`mongoose`);
const socialMessages = require(`./socialMessages`);
/*
 * something useful
 */
const videoSchema = new mongoose.Schema({
	title: { type: String, default: null },
	url: { type: String, default: null },
	duration: { type: Number, default: null },
	image: { type: String, default: null },
	_events: [{ type: mongoose.Schema.Types.ObjectId, default: null, ref: `Event` }],
	_speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	about: { type: String, default: null },
	social: {
		messages: socialMessages,
	},
	_hubs: [{ type: mongoose.Schema.Types.ObjectId, ref: `Hub` }],
	_tags: [{ type: mongoose.Schema.Types.ObjectId, ref: `Tag` }],
	deleted: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },
});

videoSchema.index({ title: `text`, url: `text`, about: `text`, _events: `text`, _speakers: `text` });

module.exports = mongoose.model(`Video`, videoSchema, `video`);
