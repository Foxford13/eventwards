'use strict';

const Event = require(`../../models/event`);
const User = require(`../../models/user`);
const Video = require(`../../models/video`);
const Article = require(`../../models/article`);
const Hub = require(`../../models/hub`);
const Tag = require(`../../models/tag`);

async function addReferencedIdToCollections (data, params) {
	await Event.updateMany(
		{ _id: { $in: data._tags } }, { $addToSet: { '_tags': params } }).exec();

	await User.updateMany(
		{ _id: { $in: data._organisers } }, { $addToSet: { '_tags': params } }).exec();

	await User.updateMany(
		{ _id: { $in: data._users } }, { $addToSet: { '_tags': params } }).exec();

	await Article.updateMany(
		{ _id: { $in: data._articles } }, { $addToSet: { '_tags': params } }).exec();

	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $addToSet: { '_tags': params } }).exec();
	await Video.updateMany(
		{ _id: { $in: data._videos } }, { $addToSet: { '_tags': params } }).exec();
}

async function removeReferencedIdFromCollections (data) {
	await Event.updateMany(
		{ _id: { $in: data._tags } }, { $pull: { '_tags': data._id } }).exec();

	await User.updateMany(
		{ _id: { $in: data._organisers } }, { $pull: { '_tags': data._id } }).exec();

	await User.updateMany(
		{ _id: { $in: data._users } }, { $pull: { '_tags': data._id } }).exec();

	await Article.updateMany(
		{ _id: { $in: data._articles } }, { $pull: { '_tags': data._id } }).exec();

	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $pull: { '_tags': data._id } }).exec();
	await Video.updateMany(
		{ _id: { $in: data._videos } }, { $pull: { '_tags': data._id } }).exec();
}

async function adminTagsIndex (req, res) {

	let tagsIndex;
	// const populateModels = [`_organiser`, `_articles`, `_videos`, `_speakers`, `_hubs`, `_tags`];

	try {
		tagsIndex = await Tag.find().exec();

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/tags/index`, { layout: `admin.handlebars`, tagsIndex });
}

async function adminTagCreate (req, res) {

	const docTag = new Tag(req.body);

	try {
		addReferencedIdToCollections(docTag, docTag._id);

		await docTag.save();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(docTag);
}

async function adminTagNew (req, res) {

	let userData;
	let articleData;
	let hubData;
	let videoData;
	let eventData;

	try {

		eventData = await Event.find().exec();
		userData = await User.find().exec();
		articleData = await Article.find().exec();
		videoData = await Video.find().exec();
		hubData = await Hub.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	console.log(videoData);

	return res.render(`admin/tags/new`, { layout: `admin.handlebars`,
		userData,
		articleData,
		hubData,
		videoData,
		eventData });
}

const populateModels = [`_organisers`, `_articles`, `_videos`, `_speakers`, `_hubs`, `_events`];

async function adminTagEdit (req, res) {

	const tagId = req.params.id || void (0);

	let tagData;
	let userData;
	let articleData;
	let hubData;
	let videoData;
	let eventData;

	try {
		tagData = await Tag.findOne({ _id: tagId }).populate(populateModels).exec();
		eventData = await Event.find().exec();
		userData = await User.find().exec();
		articleData = await Article.find().exec();

		videoData = await Video.find().exec();
		hubData = await Hub.find().exec();
	}

	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/tags/edit`, { layout: `admin.handlebars`,
		tagData,
		userData,
		articleData,
		hubData,
		videoData,
		eventData,
	});

}

async function adminTagUpdate (req, res) {

	let tagData;
	let oldTagData;

	try {
		oldTagData = await Tag.findOne({ _id: req.params.id }).exec();
		await removeReferencedIdFromCollections(oldTagData);

		tagData = await Tag.findOne({ _id: req.params.id }).update(req.body).exec();
		await addReferencedIdToCollections(req.body, req.params.id);
	}

	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(tagData);
}

async function adminTagDelete (req, res) {

	let tagData;

	try {
		tagData = await Tag.findOne({ _id: req.params.id }).exec();
		tagData.remove();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json({ success: true });
}

module.exports = {
	adminTagsIndex,
	adminTagCreate,
	adminTagNew,
	adminTagEdit,
	adminTagUpdate,
	adminTagDelete,
};
