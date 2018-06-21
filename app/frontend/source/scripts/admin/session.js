'use strict';


$( document ).ready( () => {
	const {
		ajaxTemplate,
	} = require(`../home`);

	$(`.new-session`).on(`submit`, (event)=> {
		event.preventDefault();

		ajaxTemplate(`/admin-sessions/new`, `POST`, newSessionData($(`.new-session`)), successSession, `json`);
	});

	$(`.edit-session`).on(`submit`, (event) => {
		event.preventDefault();

		const sessionId = $(`#edit-session-id`).val();


		ajaxTemplate(`/admin-sessions/${sessionId}/edit`, `PUT`, newSessionData($(`.edit-session`)), successSession, `json`);
	});

	function newSessionData (targetForm) {

		const sessionData = {
			title: targetForm.find(`input[name='title']`).val(),
			url: targetForm.find(`input[name='url']`).val(),
			duration: targetForm.find(`input[name='duration']`).val(),
			_events: targetForm.find(`.events`).val(),
			_speakers: targetForm.find(`.speakers`).val(),
			about: targetForm.find(`input[name='about']`).val(),
			socialMessages: targetForm.find(`input[name='socialMessages']`).val(),
			_hubs: targetForm.find(`.hubs`).val(),
			_tags: targetForm.find(`.tags`).val(),
			_articles: targetForm.find(`.articles`).val(),

		};

		return sessionData;
	}

	function successSession () {


	}

	$(`.btn-delete-session`).on(`click`, (event) => {

		const sessionDeleteId = event.target.id;
		ajaxTemplate(`/admin-sessions/${sessionDeleteId}`, `DELETE`, {}, deleteReload);

	});
	function deleteReload () {
		location.reload();
	}


});
