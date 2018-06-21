'use strict';


const Event = require(`../../models/event`);
const User = require(`../../models/user`);
const Video = require(`../../models/video`);
const Article = require(`../../models/article`);
const Hub = require(`../../models/hub`);
const Tag = require(`../../models/tag`);

async function addReferencedIdToCollections (data, params) {
	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $addToSet: { '_articles': params } }).exec();

	await Event.updateMany(
		{ _id: { $in: data._events } }, { $addToSet: { '_articles': params } }).exec();

	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $addToSet: { '_articles': params } }).exec();

}
async function removeReferencedIdFromCollections (data) {

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $pull: { '_articles': data._id } }).exec();

	await Event.updateMany(
		{ _id: { $in: data._events } }, { $pull: { '_articles': data._id } }).exec();

	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $pull: { '_articles': data._id } }).exec();

}

async function adminArticlesIndex (req, res) {

	let articlesIndex;

	try {
		articlesIndex = await Article.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/articles/index`, { layout: `admin.handlebars`, articlesIndex });
}

async function adminArticleNew (req, res) {

	let userData;
	let videoData;
	let articleData;
	let hubData;
	let tagData;

	try {
		userData = await User.find().exec();
		videoData = await Video.find().exec();
		articleData = await Article.find().exec();
		hubData = await Hub.find().exec();
		tagData = await Tag.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/articles/new`, { layout: `admin.handlebars`, userData, videoData, articleData, hubData, tagData });
}

async function adminArticleCreate (req, res) {

	const docArticle = new Article(req.body);

	try {
		await addReferencedIdToCollections(docArticle, docArticle._id);
		await docArticle.save();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(docArticle);

}

async function adminArticleEdit (req, res) {

	const articleId = req.params.id || void (0);
	let articleData;
	let eventData;
	let userData;
	let tagData;
	let hubData;

	const populateModels = [`_events`, `_speakers`, `_hubs`, `_tags`];


	try {
		articleData = await Article.findOne({ _id: articleId }).populate(populateModels).exec();
		userData = await User.find().exec();
		userData = await User.find().exec();
		tagData = await Tag.find().exec();
		hubData = await Hub.find().exec();
	}

	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/articles/edit`, { layout: `admin.handlebars`, eventData, userData, tagData, articleData, hubData });
}

async function adminArticleUpdate (req, res) {

	let oldArticleData;
	let articleData;

	try {
		oldArticleData = await Article.findOne({ _id: req.params.id }).exec();
		await removeReferencedIdFromCollections(oldArticleData);

		articleData = await Article.findOne({ _id: req.params.id }).update(req.body).exec();
		await addReferencedIdToCollections(articleData, req.params.id);

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(articleData);
}

async function adminArticleDelete (req, res) {

	let articleData;

	try {
		articleData = await Article.findOne({ _id: req.params.id }).exec();
		articleData.remove();

	}
	catch (err) {
		return res.status(500).end(err.message);
	}


	return res.json({ success: true });
}





module.exports = {
	adminArticlesIndex,
	adminArticleCreate,
	adminArticleNew,
	adminArticleEdit,
	adminArticleUpdate,
	adminArticleDelete,
};
