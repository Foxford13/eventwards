'use strict';

const User = require(`../models/user`);
const Article = require(`../models/article`);
const Event = require(`../models/event`);
const Video = require(`../models/video`);
const Hub = require(`../models/hub`);
const Tag = require(`../models/tag`);
const Session = require(`../models/session`);
const Customize = require(`../models/customize`);
const postmark = require(`postmark`);
const {
	searchReferenced,
} = require(`./search`);
const moment = require(`moment`);

function formatedDateCard (eventsData, originalEventsData, dateFormat, secondDateFormat) {

	for (let index = 0; index < originalEventsData.length; index++) {

		if (!secondDateFormat) {
			secondDateFormat = dateFormat;
		}

		eventsData.push({
			name: originalEventsData[index].name,
			location: originalEventsData[index].location,
			imageFileName: originalEventsData[index].imageFileName,
			_id: originalEventsData[index]._id,
			eventDate: {
				start: moment(originalEventsData[index].eventDate.start).format(`${secondDateFormat}`),
				finish: moment(originalEventsData[index].eventDate.finish).format(`${dateFormat}`),
			},
		});
	}
}

function formatedDateCardSessions (sessionsData, originalSessionsData, dateFormat) {

	for (let index = 0; index < originalSessionsData.length; index++) {

		sessionsData.push({
			topic: originalSessionsData[index].topic,
			stage: originalSessionsData[index].stage,
			_speakers: originalSessionsData[index]._speakers,
			_id: originalSessionsData[index]._id,
			sessionTimes: {
				start: moment(originalSessionsData[index].sessionTimes.start).format(`${dateFormat}`),
				finish: moment(originalSessionsData[index].sessionTimes.finish).format(`${dateFormat}`),
			},
		});

	}

}

// formatedDateCardSessions(sessionsData, originalSessionsData, `HH.mm`);

async function homeView (req, res) {

	const searchArray = decodeURI(req.query.keywords).split(/\s+/);

	let hubData;
	// let eventsData;
	let speakerData;
	let videosData;
	let eventsData = [];
	let customizeData;

	try {
		customizeData = await Customize.find().exec();
		if (typeof req.query.keywords === `undefined`) {

			hubData = await Hub.find().populate(`_tags`).exec();
			var originalEventsData = await Event.find().exec();
			videosData = await Video.find().populate(`_events`).exec();
			speakerData = await User.find().exec();

			formatedDateCard(eventsData, originalEventsData, `D MMM YYYY`, `D`);

		}
		else {

			const speakerArray = [];
			const videosArray = [];
			const hubsArray = [];
			const eventsArray = [];

			/*
			*     Referenced search function invoked
			*/

			const speakersToEvent = await searchReferenced(searchArray, User, `_speakers`, `event`);
			const organiserToEvent = await searchReferenced(searchArray, User, `_organiser`, `event`);
			const videosToEvent = await searchReferenced(searchArray, Video, `_videos`, `event`);
			const articlesToEvent = await searchReferenced(searchArray, Article, `_articles`, `event`);
			const hubsToEvent = await searchReferenced(searchArray, Hub, `_hubs`, `event`);
			const tagsToEvent = await searchReferenced(searchArray, Tag, `_tags`, `event`);

			const eventsToVideo = await searchReferenced(searchArray, Event, `_events`, `video`);
			const speakersToVideo = await searchReferenced(searchArray, User, `_speakers`, `video`);
			const hubsToVideo = await searchReferenced(searchArray, Hub, `_hubs`, `video`);
			const tagsToVideo = await searchReferenced(searchArray, Tag, `_tags`, `video`);

			const eventOrgToUser = await searchReferenced(searchArray, Event, `events._organising`, `user`);
			const eventSpeakToUser = await searchReferenced(searchArray, Event, `events._speaking`, `user`);
			const tagsToUser = await searchReferenced(searchArray, Tag, `_tags`, `user`);
			const articlesToUser = await searchReferenced(searchArray, Article, `_articles`, `user`);
			const videosToUser = await searchReferenced(searchArray, Video, `_videos`, `user`);

			const eventsToHub = await searchReferenced(searchArray, Event, `_events`, `hub`);
			const organisersToHub = await searchReferenced(searchArray, User, `_organisers`, `hub`);
			const speakersToHub = await searchReferenced(searchArray, User, `_speakers`, `hub`);
			const articlesToHub = await searchReferenced(searchArray, Article, `_articles`, `hub`);
			const videosToHub = await searchReferenced(searchArray, Video, `_videos`, `hub`);
			const prioTagToHub = await searchReferenced(searchArray, Tag, `_priorityTags`, `hub`);
			const tagToHub = await searchReferenced(searchArray, Tag, `_tags`, `hub`);

			await Promise.all(searchArray.map(async (queryString) => {

				const manyVideos = await Video.aggregate(
					{
						$match: {
							$text: { $search: queryString },
						},
					}
				).exec();

				const manyEvents = await Event.aggregate(
					{
						$match: {
							$text: { $search: queryString },
						},
					}
				).exec();

				const manySpeakers = await User.aggregate(
					{
						$match: {
							$text: { $search: queryString },
						},
					}
				).exec();

				const manyHubs = await Hub.aggregate(
					{
						$match: {
							$text: { $search: queryString },
						},
					}
				).exec();


				var searchHubArray = [eventsToHub, organisersToHub, tagToHub, speakersToHub, articlesToHub, videosToHub, prioTagToHub, manyHubs];

				searchHubArray.forEach(function (element) {
					hubsArray.push(...element);
				});
				//
				// hubsArray.push(...eventsToHub);
				// hubsArray.push(...organisersToHub);
				// hubsArray.push(...tagToHub);
				// hubsArray.push(...speakersToHub);
				// hubsArray.push(...articlesToHub);
				// hubsArray.push(...videosToHub);
				// hubsArray.push(...prioTagToHub);
				// hubsArray.push(...manyHubs);
				//


				videosArray.push(...tagsToVideo);
				videosArray.push(...hubsToVideo);
				videosArray.push(...eventsToVideo);
				videosArray.push(...speakersToVideo);
				videosArray.push(...manyVideos);

				speakerArray.push(...eventOrgToUser);
				speakerArray.push(...eventSpeakToUser);
				speakerArray.push(...tagsToUser);
				speakerArray.push(...videosToUser);
				speakerArray.push(...articlesToUser);
				speakerArray.push(...manySpeakers);

				eventsArray.push(...tagsToEvent);
				eventsArray.push(...hubsToEvent);
				eventsArray.push(...articlesToEvent);
				eventsArray.push(...speakersToEvent);
				eventsArray.push(...organiserToEvent);
				eventsArray.push(...videosToEvent);
				eventsArray.push(...manyEvents);

				speakerData = 	speakerArray;
				videosData = videosArray;
				hubData = hubsArray;
				originalEventsData = eventsArray;

				formatedDateCard(eventsData, originalEventsData, `D MMM YYYY`, `D`);




			}));
		}

		eventsData = eventsData.sort((dateA, dateB) => {
			return new Date(dateA.eventDate.start).getTime() - new Date(dateB.eventDate.start).getTime();
		});

	}
	catch (err) {
		return res.status(500).end(err.message);
	}
	console.log('CCCCCCCCCCCC', customizeData);
	res.render(`home`, { eventsData, videosData, hubData, speakerData, customizeData });

}

async function speakerShow (req, res) {

	const userId = req.params.id || void (0);

	let speakerData;
	let hubData;
	let eventDetails;
	let tagData;
	const eventsData = [];
	const speakersData = [];
	const articlesData = [];
	const videosData = [];



	try {
		speakerData = await User.findOne({ _id: userId }).exec();
		hubData = await Hub.findOne({ _id: speakerData._hubs }).exec();
		eventDetails = await Event.find({ _id: speakerData._events }).exec();

		const speakerTags = speakerData._tags;


		tagData = await Tag.find({ _id: { $in: speakerTags} }).populate([`_events`, `_videos`, `_articles`]).exec();

		tagData.forEach((element) => {
			eventsData.push(...element._events);
			articlesData.push(...element._articles);
			videosData.push(...element._videos);
		});

	}
	catch (err) {
		return res.status(500).end(err.message);
	}
	console.log(	speakerData,);

	const data = {
		eventDetails,
		hubData,
		speakerData,
		videosData,
		articlesData,
		eventsData,
	};

	if (req.params.noLayout) {
		data.layout = false;
	}
console.log('imhere2', speakerDetails);
	return res.render(`speaker`, data);
}

async function eventShow (req, res) {

	const eventId = req.params.id || void (0);
	let eventData;
	let sessionsData = [];
	const advertisedEventsData = [];

	const populateData = [ `_organiser`, `_articles`, `_videos`, `_speakers`, `_hubs`, `_tags`, `_sessions` ];

	try {

		eventData = await Event.findOne({ _id: eventId }).populate(populateData).exec();
		var originalSessionsData = await Session.find({ _id: { $in: eventData._sessions } }).populate(`_speakers`).exec();
		var originalAdvertisedEventsData = await Event.find().exec();

		formatedDateCard(advertisedEventsData, originalAdvertisedEventsData, `D.MM YYYY`);

		formatedDateCardSessions(sessionsData, originalSessionsData, `HH.mm`);

	}
	catch (err) {

		return res.status(500).end(err.message);
	}

	const eventDates = {
		start: moment(eventData.eventDate.start).format(`D`),
		finish: moment(eventData.eventDate.finish).format(`D MMM YYYY`),
	};

	const eventTimes = {
		start: moment(eventData.eventDate.start).format(`hh:mm`),
		finish: moment(eventData.eventDate.finish).format(`hh:mm`),
	};

	sessionsData = sessionsData.sort((dateA, dateB) => {
		return new Date(dateA.sessionTimes.start).getTime() - new Date(dateB.sessionTimes.start).getTime();
	});

	return res.render(`event`, {
		layout: `headerfree-layout.handlebars`,
		eventData,
		advertisedEventsData,
		eventDates,
		sessionsData,
		eventTimes,

	});
}

async function pricingIndex (req, res) {

	let eventDetails;
	let eventVideos;
	let hubData;

	try {
		eventDetails = await Event.find().exec();
		eventVideos = await Video.find().exec();
		hubData = await Hub.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.render(`pricing`, { layout: `secondary.handlebars`, eventDetails, eventVideos, hubData });

}

async function contactIndex (req, res) {

	let eventDetails;
	let eventVideos;
	let hubData;

	try {
		eventDetails = await Event.find().exec();
		eventVideos = await Video.find().exec();
		hubData = await Hub.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	const data = {
		eventDetails,
		eventVideos,
		hubData,
	};

	if (req.params.noLayout) {
		data.layout = false;
	}
	return res.render(`contact`, data);
}

async function usersIndex (req, res) {

	let docUsers;

	try {
		docUsers = await User.find().exec();
	}
	catch (err) {
		return res.status(500).end(err.message);
	}

	return res.json(docUsers);
}

async function contactReceiver (req, res) {

	const secureData = {
		email: req.body.email.replace(/</g, `&lt;`).replace(/>/g, `&gt;`).trim(),
		fullName: req.body.fullName.replace(/</g, `&lt;`).replace(/>/g, `&gt;`).trim(),
		text: req.body.text.replace(/</g, `&lt;`).replace(/>/g, `&gt;`),
		subject: req.body.subject.replace(/</g, `&lt;`).replace(/>/g, `&gt;`).trim(),
	};
	let eventData;

	if (req.body.organiserId) {

		try {
			eventData = await Event.findOne({ _id: req.body.organiserId});

		}
		catch (err) {
			console.log(err);
		}
		secureData.mailTo = eventData.email;
	}

	const reEmail = /@/g;

	const reName = /^(.*\s+.*)+$/;

	if (!reEmail.test(secureData.email)) {

		return res.json({ success: false });

	}
	else if (!reName.test(secureData.fullName)) {

		return res.json({ success: false });
	}
	else if (secureData.text.length < 20) {

		return res.json({ success: false });
	}
	else if (secureData.subject.indexOf(`cat`) < -1 ||
	secureData.subject.indexOf(`both`) < -1 || secureData.subject.indexOf(`dog`) < -1) {

		return res.json({ success: false });
	}
	else {

		var client = new postmark.Client(`afb93ba4-a09d-4966-a31f-08fcc9f7184b`);

		client.sendEmail({

			From: `jakub@recombix.com`,
			To: `${secureData.mailTo}` || `jakub@recombix.com`,
			Reply: `${secureData.email}`,
			Subject: `${secureData.subject}`,
			TextBody: `${secureData.text} ${secureData.email}`,
		});

		if (!secureData.mailTo) {
			client.sendEmail({
				From: `jakub@recombix.com`,
				To: `${secureData.email}`,
				Subject: `Thank you for contacting eventwards`,
				TextBody: `Thank you for contacting eventwards, our representative will contact you shortly`,
			});

		}

		return res.json({ success: true });
	}
}

function titoView (req, res) {

	return res.render(`tito`);
}

async function videoView (req, res) {

	const videoId = req.params.id || void (0);


	let videoData;
	let mainSpeakerData;
	let tagData;
	const populateData = [`_organiser`, `_articles`, `_events`, `_speakers`, `_hubs`, `_tags`];

	const eventsData = [];
	const speakersData = [];
	const articlesData = [];
	const videosData = [];

	try {
		videoData = await Video.findOne({ _id: videoId }).populate(populateData).exec();
		mainSpeakerData = await User.findOne({ _id: videoData._speakers[0]._id }).populate([`_videos`, `_articles` ]).exec();

		const videoTags = videoData._tags;


		tagData = await Tag.find({ _id: { $in: videoTags} }).populate([`_events`, `_speakers`, `_videos`, `_articles`]).exec();

		tagData.forEach((element) => {

			eventsData.push(...element._events);
			speakersData.push(...element._speakers);
			articlesData.push(...element._articles);
			videosData.push(...element._videos);
		});

	}
	catch (err) {
		return res.status(500).end(err.message);
	}
console.log(speakersData);


	const data = {
		videoData,
		mainSpeakerData,
		tagData,
		eventsData,
		speakersData,
		articlesData,
		videosData,

	};


	if (req.params.noLayout) {
		data.layout = false;
	}

	return res.render(`video`, data);
}

homeView.priority = 1.0;

module.exports = {
	homeView,
	speakerShow,
	usersIndex,
	pricingIndex,
	contactIndex,
	eventShow,
	contactReceiver,
	titoView,
	videoView,
};
