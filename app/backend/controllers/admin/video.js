'use strict';

const Event = require(`../../models/event`);
const User = require(`../../models/user`);
const Video = require(`../../models/video`);
const Article = require(`../../models/article`);
const Hub = require(`../../models/hub`);
const Tag = require(`../../models/tag`);
// const moment = require(`moment`);

/*
* templates and refactored functions
*/

const populateModels = [`_organiser`, `_articles`, `_events`, `_speakers`, `_hubs`, `_tags`];

async function addReferencedIdToCollections (data, params) {

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $addToSet: { '_videos': params } }).exec();

	await Event.updateMany(
		{ _id: { $in: data._events } }, { $addToSet: { '_videos': params } }).exec();

	await User.updateMany(
		{ _id: { $in: data._speakers } }, { $addToSet: { '_videos': params } }).exec();

	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $addToSet: { '_videos': params } }).exec();
}

async function removeReferencedIdFromCollections (data) {

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $pull: { '_videos': data._id } }).exec();

	await Event.updateMany(
		{ _id: { $in: data._events } }, { $pull: { '_videos': data._id } }).exec();

	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $pull: { '_videos': data._id } }).exec();

	await User.updateMany(
		{ _id: { $in: data._speakers } }, { $pull: { '_videos': data._id } }).exec();
}

/*
* methods for the controller
*/

async function adminVideosIndex (req, res) {

	let videosIndex;

	try {
		videosIndex = await Video.find().populate(populateModels).exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/videos/index`, { layout: `admin.handlebars`, videosIndex });

}

async function adminVideoNew (req, res) {

	let userData;
	let eventData;
	let hubData;
	let tagData;
	let articleData;

	try {
		userData = await User.find().exec();
		eventData = await Event.find().exec();
		hubData = await Hub.find().exec();
		tagData = await Tag.find().exec();
		articleData = await Article.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/videos/new`, { layout: `admin.handlebars`,  userData, eventData, hubData, tagData, articleData });
}

async function adminVideoCreate (req, res) {

	const docVideo = new Video(req.body);

	try {
		await addReferencedIdToCollections(docVideo, docVideo._id);
		await docVideo.save();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(docVideo);
}

async function adminVideoEdit (req, res) {

	const videoId = req.params.id || void (0);
	let videoData;
	let userData;
	let hubData;
	let eventData;
	let tagData;

	try {
		videoData = await Video.findOne({ _id: videoId }).populate(populateModels).exec();
		userData = await User.find().exec();
		hubData = await Hub.find().exec();
		eventData = await Event.find().exec();
		tagData = await Tag.find().exec();
	}

	catch (err) {
		return res.status(500).end(err.message);
	}
	return res.render(`admin/videos/edit`, { layout: `admin.handlebars`, videoData, userData, tagData, hubData, eventData });

}

async function adminVideoUpdate (req, res) {

	let videoData;
	let oldVideoData;

	try {
		oldVideoData = await Video.findOne({ _id: req.params.id }).exec();
		await	removeReferencedIdFromCollections(oldVideoData);

		videoData = await Video.findOne({ _id: req.params.id }).update(req.body).exec();
		await addReferencedIdToCollections(req.body, req.params.id );

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(videoData);
}

async function adminVideoDelete (req, res) {

	let videoData;

	try {
		videoData = await Video.findOne({ _id: req.params.id }).exec();
		videoData.remove();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json({ success: true });
}

module.exports = {
	adminVideosIndex,
	adminVideoCreate,
	adminVideoNew,
	adminVideoEdit,
	adminVideoUpdate,
	adminVideoDelete,
};
