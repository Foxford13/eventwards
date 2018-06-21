'use strict';

const Event = require(`../../models/event`);
const User = require(`../../models/user`);
const Video = require(`../../models/video`);
const Article = require(`../../models/article`);
const Hub = require(`../../models/hub`);
const Tag = require(`../../models/tag`);
const Session = require(`../../models/session`);

async function addReferencedIdToCollections (data, params) {

	await Event.updateMany(
		{ _id: { $in: data._events } }, { $addToSet: { '_hubs': params } }).exec();

	await User.updateMany(
		{ _id: { $in: data._organisers } }, { $addToSet: { '_hubs': params } }).exec();

	await User.updateMany(
		{ _id: { $in: data._speakers } }, { $addToSet: { '_hubs': params } }).exec();

	await Article.updateMany(
		{ _id: { $in: data._articles } }, { $addToSet: { '_hubs': params } }).exec();

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $addToSet: { '_hubs': params } }).exec();

	await Video.updateMany(
		{ _id: { $in: data._videos } }, { $addToSet: { '_hubs': params } }).exec();

	await Tag.updateMany(
		{ _id: { $in: data._priorityTags } }, { $addToSet: { '_hubs': params } }).exec();

	await Session.updateMany(
		{ _id: { $in: data._sessions } }, { $addToSet: { '_hubs': params } }).exec();
}

async function removeReferencedIdFromCollections (data) {

	await Event.updateMany(
		{ _id: { $in: data._events } }, { $pull: { '_hubs': data._id } }).exec();

	await User.updateMany(
		{ _id: { $in: data._organisers } }, { $pull: { '_hubs': data._id } }).exec();

	await User.updateMany(
		{ _id: { $in: data._speakers } }, { $pull: { '_hubs': data._id } }).exec();

	await Article.updateMany(
		{ _id: { $in: data._articles } }, { $pull: { '_hubs': data._id } }).exec();

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $pull: { '_hubs': data._id } }).exec();

	await Video.updateMany(
		{ _id: { $in: data._videos } }, { $pull: { '_hubs': data._id } }).exec();

	await Tag.updateMany(
		{ _id: { $in: data._priorityTags } }, { $pull: { '_hubs': data._id } }).exec();

	await Session.updateMany(
		{ _id: { $in: data._sessions } }, { $pull: { '_hubs': data._id } }).exec();
}

const populateModels = [`_organiser`, `_articles`, `_events`, `_speakers`, `_hubs`, `_tags`];

async function adminHubsIndex (req, res) {

	let hubsIndex;
	// const populateModels = [`_organiser`, `_articles`, `_videos`, `_speakers`, `_hubs`, `_hubs`];

	try {
		hubsIndex = await Hub.find().populate(`_tags`).exec();

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/hubs/index`, { layout: `admin.handlebars`, hubsIndex });
}

async function adminHubCreate (req, res) {

	const docHub = new Hub(req.body);


	try {
		addReferencedIdToCollections(docHub, docHub._id);

		await docHub.save();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(docHub);
}

async function adminHubNew (req, res) {

	let userData;
	let videoData;
	let articleData;
	let hubData;
	let tagData;
	let eventData;
	try {
		userData = await User.find().exec();
		videoData = await Video.find().exec();
		articleData = await Article.find().exec();
		hubData = await Hub.find().exec();
		tagData = await Tag.find().exec();
		eventData = await Event.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	console.log(userData);
	return res.render(`admin/hubs/new`, { layout: `admin.handlebars`, userData, videoData, articleData, hubData, tagData, eventData });
}

async function adminHubEdit (req, res) {

	const hubId = req.params.id || void (0);
	let hubData;
	let userData;

	let eventData;
	let tagData;

	try {
		hubData = await Hub.findOne({ _id: hubId }).exec();
		userData = await User.find().exec();

		eventData = await Event.find().exec();
		tagData = await Tag.find().exec();
	}

	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/hubs/edit`, { layout: `admin.handlebars`, hubData, userData, tagData, eventData });

}

async function adminHubUpdate (req, res) {

	let hubData;
	let oldHubData;

	try {
		oldHubData = await Hub.findOne({ _id: req.params.id }).exec();
		await removeReferencedIdFromCollections (oldHubData);

		hubData = await Hub.findOne({ _id: req.params.id }).update(req.body).exec();
		await addReferencedIdToCollections(req.body, req.params.id );

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(hubData);
}

async function adminHubDelete (req, res) {

	let videoData;

	try {
		videoData = await Hub.findOne({ _id: req.params.id }).exec();
		videoData.remove();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json({ success: true });
}

module.exports = {
	adminHubsIndex,
	adminHubCreate,
	adminHubNew,
	adminHubEdit,
	adminHubUpdate,
	adminHubDelete,
};
