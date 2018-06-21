'use strict';

const mongoose = require(`mongoose`);
const socialMessages = require(`./socialMessages`);

const hubSchema = new mongoose.Schema({
	name: { type: String, default: null },
	slug: { type: String, default: null },
	imageUrl: { type: String, default: null },
	_events: [{ type: mongoose.Schema.Types.ObjectId, ref: `Event` }],
	_organisers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	_speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	_sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: `Session` }],
	_tags: [{ type: mongoose.Schema.Types.ObjectId, ref: `Tag` }],
	_priorityTags: [{ type: mongoose.Schema.Types.ObjectId, ref: `Tag` }],
	_articles: [{ type: mongoose.Schema.Types.ObjectId, ref: `Article` }],
	_videos: [{ type: mongoose.Schema.Types.ObjectId, ref: `Video` }],
	deleted: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },
	social: {
		messages: socialMessages,
	},
});

hubSchema.index({ name: `text`, _speakers: `text`, _organisers: `text`, _tags: `text`,
	_videos: `text` });

module.exports = mongoose.model(`Hub`, hubSchema, `hub`);
