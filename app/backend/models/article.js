'use strict';

/*
 * MODEL: Video
 */

const mongoose = require(`mongoose`);
const socialMessages = require(`./socialMessages`);

const articleSchema = new mongoose.Schema({
	title: { type: String, default: null },
	url: { type: String, default: null },
	imageUrl: { type: String, default: null },
	_events: [{ type: mongoose.Schema.Types.ObjectId, ref: `Event` }],
	_speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	body: { type: String, default: null },
	social: {
		messages: socialMessages,
	},
	_hubs: [{ type: mongoose.Schema.Types.ObjectId, ref: `Hub` }],
	_tags: [{ type: mongoose.Schema.Types.ObjectId, ref: `Tag` }],
	deleted: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },
});

articleSchema.index({ title: `text`, url: `text`, _events: `text`, _speakers: `text` });

module.exports = mongoose.model(`Article`, articleSchema, `article`);
