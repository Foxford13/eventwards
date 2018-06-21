'use strict';

/*
 * MODEL: Customize page
 */

const mongoose = require(`mongoose`);

const customizePageSchema = new mongoose.Schema({
	mainPageImageUrl: { type: String, default: null },
	aboutCompany: { type: String, default: null },

});

module.exports = mongoose.model(`Customize`, customizePageSchema, `customize`);
