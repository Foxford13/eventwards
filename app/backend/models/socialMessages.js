'use strict';

/*
* MODEL: Event
*/

const mongoose = require(`mongoose`);

/*
*
*/

const socialMessagesSchema = new mongoose.Schema({
	email: {
		subject: { type: String, default: null },
		body: { type: String, default: null },
	},
	twitter: { type: String, default: null },
	facebook: { type: String, default: null },
	linkedin: { type: String, default: null },
}, {
	_id: false,
});

module.exports = socialMessagesSchema;
