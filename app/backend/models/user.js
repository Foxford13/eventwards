'use strict';

const mongoose = require(`mongoose`);
const socialMessages = require(`./socialMessages`);
// const textSearch = require(`mongoose-text-search`);

const loginTokenSchema = new mongoose.Schema({
	value: String,
	dateIssued: Date,
}, {
	_id: false,
});

const authenticationTokenSchema = new mongoose.Schema({
	value: String,
	dateIssued: Date,
}, {
	_id: false,
});
// mongoose.set(`debug`, true);

const userSchema = new mongoose.Schema({
	fullName: { type: String, default: null },
	organisation: { type: String, default: null },
	profession: { type: String, default: null },
	imageUrl: { type: String, default: null },
	backgroundImageUrl: { type: String, default: null },
	loginTokens: [ loginTokenSchema ],
	location: { type: String, default: null },
	email: { type: String, default: null },
	bio: { type: String, default: null },
	authenticationTokens: [ authenticationTokenSchema ],
	social: {
		messages: socialMessages,
	},
	events: {
		_attending: [{ type: mongoose.Schema.Types.ObjectId, ref: `Event` }],
		_organising: [{ type: mongoose.Schema.Types.ObjectId, ref: `Event` }],
		_speaking: [{ type: mongoose.Schema.Types.ObjectId, ref: `Event` }],
	},
	roles: [{ type: String }],
	_tags: [{ type: mongoose.Schema.Types.ObjectId, ref: `Tag` }],
	_sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: `Session` }],
	_articles: [{ type: mongoose.Schema.Types.ObjectId, ref: `Article` }],
	_videos: [{ type: mongoose.Schema.Types.ObjectId, ref: `Video` }],
	deleted: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },
});

userSchema.index({ organisation: `text`, fullName: `text`, profession: `text`, location: `text`,
	events: `text`, _videos: `text` });

const userModel = mongoose.model(`User`, userSchema, `user`);

module.exports = userModel;
