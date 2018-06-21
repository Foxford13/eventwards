'use strict';

$(document).ready(() => {
	const {
		ajaxTemplate,
	} = require(`../home`);

	$(`.new-tag`).on(`submit`, (tag) => {
		tag.preventDefault();

		ajaxTemplate(`/admin-tags/new`, `POST`, newTagData($(`.new-tag`)), successTag, `json`);
	});

	$(`.edit-tag`).on(`submit`, (tag) => {
		tag.preventDefault();

		const tagId = $(`#edit-tag-id`).val();

		ajaxTemplate(`/admin-tags/${tagId}/edit`, `PUT`, newTagData($(`.edit-tag`)), successTag, `json`);
	});

	function newTagData (targetForm) {

		const tagData = {
			name: targetForm.find(`input[name='name']`).val(),
			slug: targetForm.find(`input[name='slug']`).val(),
			_events: targetForm.find(`.events`).val(),
			_speakers: targetForm.find(`.speakers`).val(),
			_organisers: targetForm.find(`.organiser`).val(),
			_videos: targetForm.find(`.videos`).val(),
			_articles: targetForm.find(`.articles`).val(),
			_hubs: targetForm.find(`.hubs`).val(),

		};

		return tagData;
	}

	function successTag () {
		// location.href = `/admin-tags`;

	}

	$(`.btn-delete-tag`).on(`click`, (tag) => {

		const tagDeleteId = tag.target.id;
		ajaxTemplate(`/admin-tags/${tagDeleteId}`, `DELETE`, {}, deleteReload);

	});
	function deleteReload () {
		location.reload();
	}

});
