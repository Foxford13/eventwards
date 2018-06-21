'use strict';

$(document).ready(() => {
	const {
		ajaxTemplate,
	} = require(`../home`);

	$(`.new-video`).on(`submit`, (event) => {
		event.preventDefault();

		ajaxTemplate(`/admin-videos/new`, `POST`, newVideoData($(`.new-video`)), successVideo, `json`);
	});

	$(`.edit-video`).on(`submit`, (event) => {
		event.preventDefault();

		const videoId = $(`#edit-video-id`).val();

		ajaxTemplate(`/admin-videos/${videoId}/edit`, `PUT`, newVideoData($(`.edit-video`)), successVideo, `json`);
	});

	function newVideoData (targetForm) {

		const videoData = {
			title: targetForm.find(`input[name='title']`).val(),
			url: targetForm.find(`input[name='url']`).val(),
			// duration: targetForm.find(`input[name='duration']`).val(),
			image: targetForm.find(`input[name='image']`).val(),
			_events: targetForm.find(`.events`).val(),
			_speakers: targetForm.find(`.speakers`).val(),
			about: targetForm.find(`textarea[name='about']`).val(),
			socialMessages: targetForm.find(`input[name='socialMessages']`).val(),
			_hubs: targetForm.find(`.hubs`).val(),
			_tags: targetForm.find(`.tags`).val(),

		};
console.log(videoData);
		return videoData;
	}

	function successVideo () {
		// location.href = `/admin-videos`;
	}

	$(`.btn-delete-video`).on(`click`, (event) => {

		const videoDeleteId = event.target.id;
		ajaxTemplate(`/admin-videos/${videoDeleteId}`, `DELETE`, {}, deleteReload);

	});
	function deleteReload () {
		location.reload();
	}

});
