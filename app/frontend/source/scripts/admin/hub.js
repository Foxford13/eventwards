'use strict';

$(document).ready(() => {
	const {
		ajaxTemplate,
	} = require(`../home`);

	$(`.new-hub`).on(`submit`, (event) => {
		event.preventDefault();

		ajaxTemplate(`/admin-hubs/new`, `POST`, newHubData($(`.new-hub`)), successHub, `json`);
	});

	$(`.edit-hub`).on(`submit`, (event) => {
		event.preventDefault();

		const hubId = $(`#edit-hub-id`).val();

		ajaxTemplate(`/admin-hubs/${hubId}/edit`, `PUT`, newHubData($(`.edit-hub`)), successHub, `json`);
	});

	function newHubData (targetForm) {

		const hubData = {
			name: targetForm.find(`input[name='name']`).val(),
			slug: targetForm.find(`input[name='slug']`).val(),
			imageUrl: targetForm.find(`input[name='imageUrl']`).val(),
			_events: targetForm.find(`.events`).val(),
			_organiser: targetForm.find(`.organiser`).val(),
			_speakers: targetForm.find(`.speakers`).val(),
			_tags: targetForm.find(`.tags`).val(),
			_priorityTags: targetForm.find(`input[name='priorityTags']`).val(),
			_articles: targetForm.find(`.articles`).val(),
			_videos: targetForm.find(`.videos`).val(),

		};

		return hubData;
	}

	function successHub () {
		// location.href = `/admin-hubs`;

	}

	$(`.btn-delete-hub`).on(`click`, (event) => {

		const hubDeleteId = event.target.id;
		ajaxTemplate(`/admin-hubs/${hubDeleteId}`, `DELETE`, {}, deleteReload);

	});
	function deleteReload () {
		location.reload();
	}
});
