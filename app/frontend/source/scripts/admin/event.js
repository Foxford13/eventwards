'use strict';


$(document).ready(() => {

	const {
		ajaxTemplate,
	} = require(`../home`); // eslint-disable-line

	function successEvent () {

		// appendErrorFormVal(data);
		// location.href = `/admin-events`;
	}

	$(`.new-event`).on(`submit`, (event) => {
		event.preventDefault();

		ajaxTemplate(`/admin-events/new`, `POST`, newEventData($(`.new-event`)), successEvent(), `json`);
	});

	$(`.edit-event`).on(`submit`, (event) => {
		event.preventDefault();

		const eventId = $(`#edit-event-id`).val();

		ajaxTemplate(`/admin-events/${eventId}/edit`, `PUT`, newEventData($(`.edit-event`)), successEvent, `json`);
	});

	function collectSponsorsObject (collectClass) {

		const arrayOfSponsors = [];
		const name = document.getElementsByClassName(`${collectClass}-name`);
		const fileName = document.getElementsByClassName(`${collectClass}-filename`);
		const url = document.getElementsByClassName(`${collectClass}-url`);

		for (let index = 0; index < name.length; index++) {
				console.log('I work tooo' + fileName[index].value);
			if (!/^\s*$/.test(fileName[index].value)) {
				console.log('I work' + fileName);
				arrayOfSponsors.push({
					name: name[index].value,
					sponsorLogoUrl: fileName[index].value,
					sponsorPageUrl: url[index].value,
				});
			}
		}
		return arrayOfSponsors;
	}

	function collectSessions () {

		const arrayOfSessions = [];
		const _id = $(`.session-id`);
		const topic = $(`.session-topic`);
		const stage = $(`.session-stage`);
		const timeStart = $(`.session-time-from`);
		const timeFinish = $(`.session-time-to`);
		const speakers = $(`.session-speakers`);

		for (let index = 0; index < topic.length; index++) {
			const properties = {
				topic: topic[index].value,
				stage: stage[index].value,

				sessionTimes: {
					start: timeStart[index].value,
					finish: timeFinish[index].value,
				},

			};

			if (typeof _id[index] !== `undefined`) {

				properties._id = _id[index].defaultValue;
			}

			if ($(speakers[index])) {
				properties._speakers = $(speakers[index]).val();
			}

			arrayOfSessions.push(properties);
		}
		return arrayOfSessions;
	}

	function collectTakeaways () {

		const arrayOfTakeaways = [];
		const takeaways = $(`.takeaways-value`);

		for (let index = 0; index < takeaways.length; index++) {
			if (!/^\s*$/.test(takeaways[index].value)) {
				console.log(takeaways[index].value);
				arrayOfTakeaways.push(takeaways[index].value);
			}

		}
		return arrayOfTakeaways;
	}

	/*
	* Data structured to be posted to backend
	*/

	function newEventData (targetForm) {

		const eventData = {

			name: targetForm.find(`input[name='name']`).val(),
			email: targetForm.find(`input[name='email']`).val(),
			imageFileName: targetForm.find(`input[name='image-file-name']`).val(),
			location: targetForm.find(`input[name='location']`).val(),
			address: targetForm.find(`input[name='address']`).val(),
			about: targetForm.find(`textarea[name='about']`).val(),
			hashtagOrganiser: targetForm.find(`input[name='hashtag-organiser']`).val(),
			titoId: targetForm.find(`input[name='tito-id']`).val(),
			organiserLogoUrl: targetForm.find(`input[name='organiser-logo-url']`).val(),
			quote: targetForm.find(`input[name='quote']`).val(),
			backgroundImageUrl: targetForm.find(`input[name='background-img-url']`).val(),
			takeaways: collectTakeaways(),
			sessionsData: collectSessions(targetForm),
			eventDate: {
				dateFrom: targetForm.find(`input[name='date-from']`).val(),
				dateTo: targetForm.find(`input[name='date-to']`).val(),
				timeFrom: targetForm.find(`input[name='time-from']`).val(),
				timeTo: targetForm.find(`input[name='time-to']`).val(),
			},
			_speakers: targetForm.find(`.speakers`).val(),
			_organiser: targetForm.find(`.organiser`).val(),
			_videos: targetForm.find(`.videos`).val(),
			_articles: targetForm.find(`.articles`).val(),
			_hubs: targetForm.find(`.hubs`).val(),
			_tags: targetForm.find(`.tags`).val(),
			social: {
				messages: {
					twitter: targetForm.find(`.social-twitter`).val(),
					facebook: targetForm.find(`.social-facebook`).val(),
					linkedin: targetForm.find(`.social-linkedin`).val(),
				},
			},
			partners: {
				platinumSponsors: collectSponsorsObject(`plat`),
				goldSponsors: collectSponsorsObject(`gold`),
				silverSponsors: collectSponsorsObject(`silv`),
				bronzeSponsors: collectSponsorsObject(`bron`),
				media: collectSponsorsObject(`med`),
			},

		};
		console.log(eventData);
		return eventData;
	}

	$(`.btn-delete-event`).on(`click`, (event) => {
		const eventDeleteId = event.target.id;
		ajaxTemplate(`/admin-events/${eventDeleteId}`, `DELETE`, {}, deleteReload);
	});

	function deleteReload () {
		location.reload();
	}

	function successSpeakerList (data) {
		const arrOfUsers = [];
		for (let index = 0; index < data.length; index++) {
			arrOfUsers.push(`	<option value="${data[index]._id}"> ${data[index].fullName}</option>`);
		}
		$(`.session-speakers`).append(arrOfUsers);
	}

	// ajaxTemplate(`/users-index`, `GET`, {}, successSpeakerList, `json`);

	/*
	* Appendable templates
	*/
	function appendTakeaways (appendTo) {
		$(`.${appendTo}`).append(`
			<div class="pack">
			<input class="${appendTo}-value" type="text" name="${appendTo}"  placeholder="${appendTo}">
			</div>
			`
		);
	}

	function appendSponsor (appendTo) {

		$(`.${appendTo}`).append(`
			<div class="pack"
			<label for="${appendTo}-name">Name</label>
			<input class="${appendTo}-name" type="text" name="${appendTo}-name"  placeholder="${appendTo}-linkedin">

			<label for="${appendTo}-filename">Filename</label>
			<input class="${appendTo}-filename" type="text" name="${appendTo}-filename"  placeholder="${appendTo}-filename">

			<label for="${appendTo}-url">url</label>
			<input class="${appendTo}-url" type="text" name="${appendTo}-url"  placeholder="${appendTo}-url">
			</div>
			`
		);
	}

	const sessionTemplate = `
	<div class="sess-cont">

	<h1>Session</h1>

	<div class="info-container">
	<label for="session-topic">Topic</label>
	<input class="session-topic" type="text" name="session-topic"  placeholder="session-topic" >
	</div>

	<div class="info-container">
	<label for="session-stage">session-stage</label>
	<input class="session-stage" type="text" name="session-stage"  placeholder="session-stage" >
	</div>

	<div class="info-container">
	<label for="session-time-from">Starting time</label>
	<input type="time" name="session-time-from" class="session-time-from" placeholder="session-time-from" >
	</div>

	<div class="info-container">
	<label for="session-time-to">End</label>
	<input type="time" name="session-time-to" class="session-time-to" placeholder="session-time-to" >
	</div>

	<div class="info-container">
	<label>Speakers</label>
	<select multiple class="session-speakers" name="session-speakers">

	{{#each userData }}
	<option value="{{_id}}"> </option>
	{{/each}}

	</select>
	</div>
	<button class="delete-session-btn">Remove session</button>
	</div>
	`;

	function appendSession () {
		$(`.session`).append(sessionTemplate);
		ajaxTemplate(`/users-index`, `GET`, {}, successSpeakerList, `json`);
	}


	function appendSponsorsInitialize () {
		$(`.plat-content-btn`).on(`click`, (event) => {	event.preventDefault(); appendSponsor(`plat`); });
		$(`.gold-content-btn`).on(`click`, (event) => {	event.preventDefault(); appendSponsor(`gold`); });
		$(`.silv-content-btn`).on(`click`, (event) => { event.preventDefault(); appendSponsor(`silv`); });
		$(`.bron-content-btn`).on(`click`, (event) => {	event.preventDefault(); appendSponsor(`bron`); });
		$(`.med-content-btn`).on(`click`, (event) => {	event.preventDefault(); appendSponsor(`med`); });
		$(`.session-content-btn`).on(`click`, (event) => {	event.preventDefault(); appendSession(`med`); });
		$(`.takeaways-content-btn`).on(`click`, (event) => {	event.preventDefault(); appendTakeaways(`takeaways`); });
	}

	appendSponsorsInitialize();

	$(document).on(`click`, `.delete-session-btn`, (event) => {
		event.preventDefault();
		event.target.closest(`.sess-cont`).remove();

		// var url = window.location.href;
		var lastPart = url.substr(url.lastIndexOf(`/`) + 1);
		const sessionDeleteId = $(event.target.closest(`.sess-cont`)).find(`.session-id`)[0];
		if (lastPart === `edit` && typeof sessionDeleteId !== `undefined`) {
			ajaxTemplate(`/admin-sessions/${sessionDeleteId.defaultValue}`, `DELETE`, newEventData($(`.edit-event`)));
		}

	});

});
