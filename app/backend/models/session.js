'use strict';

const mongoose = require(`mongoose`);

const sessionSchema = new mongoose.Schema({
	topic: { type: String, default: null },
	stage: { type: String, default: null },
	_speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
	sessionTimes: {
		start: { type: Date, default: null },
		finish: { type: Date, default: null },
	},

	_event: { type: mongoose.Schema.Types.ObjectId, ref: `Event` },
	deleted: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },

});

sessionSchema.index({ name: `text`, _speakers: `text`, _organisers: `text`, _tags: `text`,
	_videos: `text` });

module.exports = mongoose.model(`Session`, sessionSchema, `session`);
