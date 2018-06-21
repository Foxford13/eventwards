'use strict';

const Event = require(`../../models/event`);
const User = require(`../../models/user`);
const Tag = require(`../../models/tag`);
const Article = require(`../../models/article`);
const Hub = require(`../../models/hub`);
const Session = require(`../../models/session`);
const Video = require(`../../models/video`);


/*
* templates and refactored functions
*/
const populateModels = [`events._organising`, `events._speaking`, `_tags`];

async function addReferencedIdToCollections (data, params) {

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $addToSet: { '_organisers': params } }).exec();

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $addToSet: { '_speakers': params } }).exec();

	if (data.events) {
		// await Event.update(
		// 	{ _id: { $in: data.events._organising } }, { $addToSet: { '_organiser': params } }).exec();

		await Event.updateMany(
			{ _id: { $in: data.events._speaking } }, { $addToSet: { '_speakers': params } }).exec();
	}

	await Session.updateMany(
		{ _id: { $in: data._sessions } }, { $addToSet: { '_speaker': params } }).exec();
}

async function removeReferencedIdFromCollections (data) {
console.log(data);

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $pull: { '_organisers': data._id } }).exec();
		console.log('1');

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $pull: { '_speakers': data.id } }).exec();
	console.log('2');
	if (data.events) {
		// await Event.update(
		// 	{ _id: { $in: data.events._organising } }, { $pull: { '_organiser': data._id } }).exec();

		await Event.updateMany(
			{ _id: { $in: data.events._speaking } }, { $pull: { '_speakers': data._id } }).exec();
	}

	await Session.updateMany(
		{ _id: { $in: data._sessions } }, { $pull: { '_speaker': data._id } }).exec();
			console.log('4');
}

/*
* methods for the controller
*/

async function adminUsersIndex (req, res) {

	let usersIndex;

	try {
		usersIndex = await User.find().populate(populateModels).exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/users/index`, { layout: `admin.handlebars`, usersIndex });
}

async function adminUserNew (req, res) {

	let eventData;
	let tagData;

	let videoData;
	let articleData;

	try {
		eventData = await Event.find().exec();
		videoData = await Video.find().exec();
		articleData = await Article.find().exec();
		tagData = await Tag.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/users/new`, { layout: `admin.handlebars`, eventData, tagData, videoData, articleData });
}

async function adminUserCreate (req, res) {

	const docUser = new User(req.body);

	try {
		await addReferencedIdToCollections(docUser, docUser._id);
		await docUser.save();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(docUser);
}

async function adminUserEdit (req, res) {

	const userId = req.params.id || void (0);
	let userData;
	let tagData;
	let eventData;
	let articleData;
	let videoData;

	try {
		userData = await User.findOne({ _id: userId }).exec();
		tagData = await Tag.find().exec();
		eventData = await Event.find().exec();
		articleData = await Article.find().exec();
		videoData = await Video.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	console.log(userData);

	return res.render(`admin/users/edit`, { layout: `admin.handlebars`, userData, tagData, eventData, articleData, videoData });
}

async function adminUserUpdate (req, res) {

	let userData;
	let oldUserData;

	try {
		oldUserData = await User.findOne({ _id: req.params.id }).exec();
		await removeReferencedIdFromCollections(oldUserData);

		userData = await User.find({ _id: req.params.id }).update(req.body).exec();
		await addReferencedIdToCollections(req.body, req.params.id);

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(userData);
}

async function adminUserDelete (req, res) {

	let userData;

	try {
		userData = await User.findOne({ _id: req.params.id }).exec();
		userData.remove();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json({ success: true });
}

module.exports = {
	adminUsersIndex,
	adminUserCreate,
	adminUserNew,
	adminUserEdit,
	adminUserUpdate,
	adminUserDelete,
};
