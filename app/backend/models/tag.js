'use strict';

const mongoose = require(`mongoose`);
const socialMessages = require(`./socialMessages`);

const tagSchema = new mongoose.Schema({
	name: { type: String, default: null },
	slug: { type: String, default: null },
	_events: [{ type: mongoose.Schema.Types.ObjectId, ref: `Event` }],
	_organisers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	_speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	_hubs: [{ type: mongoose.Schema.Types.ObjectId, ref: `Hub` }],
	_articles: [{ type: mongoose.Schema.Types.ObjectId, ref: `Article` }],
	_videos: [{ type: mongoose.Schema.Types.ObjectId, ref: `Video` }],
	deleted: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },
	social: {
		messages: socialMessages,
	},
});

tagSchema.index({ name: `text`, _speakers: `text`, _organisers: `text`, _hubs: `text`,
	_videos: `text`, _events: `text`, _articles: `text` });

module.exports = mongoose.model(`Tag`, tagSchema, `tag`);
