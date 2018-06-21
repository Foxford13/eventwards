'use strict';

const Event = require(`../../models/event`);
const User = require(`../../models/user`);
const Video = require(`../../models/video`);
const Article = require(`../../models/article`);
const Hub = require(`../../models/hub`);
const Tag = require(`../../models/tag`);
const Session = require(`../../models/session`);
const moment = require(`moment`);

/*
*   templates and refactored functions
*/
const populateModels = [`_organiser`, `_articles`, `_videos`, `_speakers`, `_hubs`, `_tags`, `_sessions`];

async function addReferencedIdToCollections (data) {

	await Video.updateMany(
		{ _id: { $in: data._videos } }, { $addToSet: { '_events': data._id } }).exec();

	await User.updateMany(
		{ _id: { $in: data._speakers } }, { $addToSet: { 'events._speaking': data._id } }).exec();

	await User.update(
		{ _id: { $in: data._organiser } }, { $addToSet: { 'events._organising': data._id } }).exec();

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $addToSet: { '_events': data._id } }).exec();

	await Article.updateMany(
		{ _id: { $in: data._articles } }, { $addToSet: { '_events': data._id } }).exec();

	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $addToSet: { '_events': data._id } }).exec();

	await Session.updateMany(
		{ _id: { $in: data._sessions } }, { $addToSet: { '_events': data._id } }).exec();

}

async function addReferencedIdToColSession (data, eventId) {
	await Event.updateMany(
		{ _id: { $in: eventId } }, { $addToSet: { '_sessions': data._id } }).exec();

}
async function removeReferencedIdFromCollections (data) {

	await Tag.updateMany(
		{ _id: { $in: data._tags } }, { $pull: { '_events': data._id } }).exec();
	await Video.updateMany(
		{ _id: { $in: data._videos } }, { $pull: { '_events': data._id } }).exec();
	await Hub.updateMany(
		{ _id: { $in: data._hubs } }, { $pull: { '_events': data._id } }).exec();

	await User.updateMany(
		{ _id: { $in: data._speakers } }, { $pull: { 'events._speaking': data._id } }).exec();
	await User.update(
		{ _id: { $in: data._organiser } }, { $pull: { 'events._organising': data._id } }).exec();

	await Article.updateMany(
		{ _id: { $in: data._articles } }, { $pull: { '_events': data._id } }).exec();

	await Session.updateMany(
		{ _id: { $in: data._sessions } }, { $pull: { '_events': data._id } }).exec();
}

function modifiedEventData (argData) {

	const defaultStartDate =
	moment(`${argData.eventDate.dateFrom} ${argData.eventDate.timeFrom}`).toDate() ||
	moment().toDate(`YYYY-MM-DDTHH:mm:ssZ`);
	const defaultFinishDate =
	moment(`${argData.eventDate.dateTo} ${argData.eventDate.timeTo}`).toDate() ||
	moment().toDate(`YYYY-MM-DDTHH:mm:ssZ`);

	const newEventData = {
		name: argData.name,
		email: argData.email,
		imageFileName: argData.imageFileName,
		quote: argData.quote,
		backgroundImageUrl: argData.backgroundImageUrl,
		location: argData.location,
		address: argData.address,
		about: argData.about,
		hashtagOrganiser: argData.hashtagOrganiser,
		organiserLogoUrl: argData.organiserLogoUrl,
		takeaways: argData.takeaways,
		titoId: argData.titoId,
		eventDate: {
			start: defaultStartDate,
			finish: defaultFinishDate,
			startTime: ``,
			finishTime: ``,
		},
		social: {
			messages: {
				twitter: argData.social.messages.twitter || void (0),
				facebook: argData.social.messages.facebook || void (0),
				linkedin: argData.social.messages.linkedin || void (0),
			},

		},
		partners: argData.partners,
		_speakers: argData._speakers || void (0),
		_organiser: argData._organiser || void (0),
		_videos: argData._videos || void (0),
		_articles: argData._articles || void (0),
		_sessions: argData._sessions || void (0),
		_hubs: argData._hubs || void (0),
		_tags: argData._tags || void (0),
		deleted: argData.deleted,
		dateCreated: argData.dateCreated,
		_id: argData._id,
	};
console.log('newEEEE', newEventData);
	return newEventData;
}

/*
*   controllers methods themselves
*/

async function adminEventsIndex (req, res) {

	let eventsIndex;

	try {
		eventsIndex = await Event.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`admin/events/index`, { layout: `admin.handlebars`, eventsIndex });
}

async function adminEventNew (req, res) {

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

	return res.render(`admin/events/new`, {
		layout: `admin.handlebars`,
		userData,
		videoData,
		articleData,
		hubData,
		tagData
	});
}

async function adminEventCreate (req, res) {

	const sessionData = req.body.sessionsData;
	const newEventData = modifiedEventData(req.body);
	const docEvent = new Event(newEventData);

	try {

		await addReferencedIdToCollections(docEvent);
		console.log(docEvent);
		await docEvent.save();

		for (let index = 0; index < sessionData.length; index++) {

			sessionData[index].sessionTimes.start = `2017-12-18T${sessionData[index].sessionTimes.start}:00.56Z`;
			sessionData[index]._event = docEvent._id;
			sessionData[index].sessionTimes.finish =
			`2017-12-18T${sessionData[index].sessionTimes.finish}:00.56Z`;

			const docSession = new Session(sessionData[index]);

			addReferencedIdToColSession(docSession, docEvent._id);

			await docSession.save();
		}

	}
	catch (err) {

		return res.status(500).end(err.message);
	}

	return res.json(docEvent);
}

async function adminEventEdit (req, res) {
console.log('im heeere');
	const eventId = req.params.id || void (0);
	let eventDataOriginal;
	let userData;
	let articleData;
	let tagData;
	let hubData;
	let videoData;
	let sessionsData;
	let eventData;

	try {
		eventDataOriginal = await Event.findOne({ _id: eventId }).populate(populateModels).exec();
		userData = await User.find().exec();
		articleData = await Article.find().exec();
		tagData = await Tag.find().exec();
		videoData = await Video.find().exec();
		hubData = await Hub.find().exec();

		sessionsData = await Session.find({ _id: eventDataOriginal._sessions }).populate(`_speakers`).lean().exec();
 		eventData = modifiedEventData(eventDataOriginal);

		const sessionsDataEx = eventData._sessions;
		for (let index = 0; index < sessionsDataEx.length; index++) {

			sessionsData[index].sessionTimes[`start`] = moment(sessionsData[index].sessionTimes.start).format(`HH:mm`);

			sessionsData[index].sessionTimes.finish = moment(sessionsData[index].sessionTimes.finish).format(`HH:mm`);

		}

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	eventData.eventDate.start = moment(eventDataOriginal.eventDate.start).format(`YYYY-MM-DD`);
	eventData.eventDate.finish = moment(eventDataOriginal.eventDate.finish).format(`YYYY-MM-DD`);
	eventData.eventDate.startTime = moment(eventDataOriginal.eventDate.start).format(`HH:mm`);
	eventData.eventDate.finishTime = moment(eventDataOriginal.eventDate.finish).format(`HH:mm`);


console.log('zzzZZZZZ', eventData);

	return res.render(`admin/events/edit`, {
		layout: `admin.handlebars`,
		eventData,
		userData,
		tagData,
		articleData,
		hubData,
		videoData,
		sessionsData,
	});
	// return res.json( eventData);
}

async function adminEventUpdate (req, res) {
console.log('UPDATE!!!!!!', req.body);
	const sessionData = req.body.sessionsData || void (0);

	let eventData;
	try {
		eventData = await Event.findOne({ _id: req.params.id }).exec();

		if (typeof sessionData !== `undefined`) {
			for (let index = 0; index < sessionData.length; index++) {

				if (!sessionData[index]._id) {

					sessionData[index].sessionTimes.start = `2017-12-18T${sessionData[index].sessionTimes.start}:00.56Z`;

					sessionData[index].sessionTimes.finish =
					`2017-12-18T${sessionData[index].sessionTimes.finish}:00.56Z`;

					sessionData[index]._event = req.params.id;

					const newSession = await	new Session(sessionData[index]);
					await addReferencedIdToColSession(newSession, req.params.id);

					await newSession.save();
				}
				else {

					sessionData[index].sessionTimes.start = `2017-12-18T${sessionData[index].sessionTimes.start}:00.56Z`;

					sessionData[index].sessionTimes.finish =
					`2017-12-18T${sessionData[index].sessionTimes.finish}:00.56Z`;

					await Session.findOne({ _id: sessionData[index]._id }).update(sessionData[index]).exec();
				}
			}
		}

		await removeReferencedIdFromCollections(eventData);

		eventData.name = req.body.name;
		eventData.email = req.body.email;
		eventData.imageFileName = req.body.imageFileName;
		eventData.about = req.body.about;
		eventData.quote = req.body.quote;
		eventData.location = req.body.location || void (0);
		eventData.address = req.body.address || void (0);
		eventData.takeaways = req.body.takeaways || void (0);
		eventData.hashtagOrganiser = req.body.hashtagOrganiser || void (0);
		eventData.organiserLogoUrl = req.body.organiserLogoUrl || void (0);
		eventData.backgroundImageUrl = req.body.backgroundImageUrl || void (0);
		eventData.titoId = req.body.titoId || void (0);
		eventData._speakers = req.body._speakers || void (0);
		eventData._organiser = req.body._organiser || void (0);
		eventData._videos = req.body._videos || void (0);
		eventData.social.messages.linkedin = req.body.social.messages.linkedin || void (0);
		eventData.social.messages.twitter = req.body.social.messages.twitter || void (0);
		eventData.social.messages.facebook = req.body.social.messages.facebook || void (0);
		eventData._articles = req.body._articles || void (0);
		eventData._tags = req.body._tags || void (0);
		eventData._hubs = req.body._hubs || void (0);
		eventData.partners = req.body.partners;
		eventData.eventDate.start =
		moment(`${req.body.eventDate.dateFrom} ${req.body.eventDate.timeFrom}`).format(`YYYY-MM-DDTHH:mm:ssZ`);
		eventData.eventDate.finish =
		moment(`${req.body.eventDate.dateTo} ${req.body.eventDate.timeTo}`).format(`YYYY-MM-DDTHH:mm:ssZ`);

		await addReferencedIdToCollections(eventData);

		await eventData.save();
		// await Event.findOne({ _id: req.params._id }).update(eventData).exec();

	}
	catch (err) {
		console.log(err.message);
		return res.status(500).end(err.message);
	}

	return res.json(eventData);
}

async function adminEventDelete (req, res) {

	let eventData;

	try {
		eventData = await Event.findOne({ _id: req.params.id }).exec();
		eventData.remove();

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json({ success: true });
}

async function removeReferencedIdToColSession (sessionData) {

	await Event.updateMany(
		{ _id: { $in: sessionData._event } }, { $pull: { '_sessions': sessionData._id } }).exec();

	await User.updateMany(
		{ _id: { $in: sessionData._speakers } }, { $pull: { '_sessions': sessionData._id } }).exec();

}

async function adminSessionDelete (req, res) {

	let sessionData;

	try {
		sessionData = await Session.findOne({ _id: req.params.id }).exec();
		await removeReferencedIdToColSession(sessionData);

		sessionData.remove();

	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json({ success: true });
}

module.exports = {
	adminEventsIndex,
	adminEventCreate,
	adminEventNew,
	adminEventEdit,
	adminEventUpdate,
	adminEventDelete,
	adminSessionDelete,
};
