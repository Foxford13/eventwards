'use strict';

const Customize = require(`../../models/customize`);
const mongoose = require(`mongoose`);
async function customizePageIndex (req, res) {

	return res.render(`admin/page-custom/index`, { layout: `admin.handlebars`});
}

async function customizePageEdit (req, res) {

	let customizeData;
	try {
		customizeData = await Customize.findOne({}).exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/page-custom/edit`, { layout: `admin.handlebars`, customizeData });
}

async function customizePageUpdate (req, res) {

	let customizeData;

	try {
		var query = {_id: req.params._id};
		if (!query._id) {
			query._id = await new mongoose.mongo.ObjectID();
		}

		customizeData = await Customize.findOneAndUpdate({}, req.body, { upsert: true }).exec();

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(customizeData);
}

module.exports = {
	customizePageIndex,
	customizePageEdit,
	customizePageUpdate,
};
