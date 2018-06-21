'use strict';


$(document).ready(() => {
	const {
		ajaxTemplate,
	} = require(`../home`);

	$(`.new-user`).on(`submit`, (event) => {
		event.preventDefault();

		ajaxTemplate(`/admin-users/new`, `POST`, newUserData($(`.new-user`)), successUser, `json`);
	});

	$(`.edit-user`).on(`submit`, (event) => {
		event.preventDefault();

		const userId = $(`#edit-user-id`).val();

		ajaxTemplate(`/admin-users/${userId}/edit`, `PUT`, newUserData($(`.edit-user`)), successUser, `json`);
	});

	function newUserData (targetForm) {

		const userData = {
			fullName: targetForm.find(`input[name='fullName']`).val(),
			email: targetForm.find(`input[name='email']`).val(),
			profession: targetForm.find(`input[name='profession']`).val(),
			imageUrl: targetForm.find(`input[name='imageUrl']`).val(),
			backgroundImageUrl: targetForm.find(`input[name='backgroundImageUrl']`).val(),
			organisation: targetForm.find(`input[name='organisation']`).val(),
			location: targetForm.find(`input[name='location']`).val(),
			bio: targetForm.find(`textarea[name='bio']`).val(),
			roles: targetForm.find(`input[name='roles']`).val(),
			events: {
				_organising: targetForm.find(`.organising-events`).val(),
				_speaking: targetForm.find(`.speaking-events`).val(),
			},
			_tags: targetForm.find(`.tags`).val(),
			_articles: targetForm.find(`.articles`).val(),
			_videos: targetForm.find(`.videos`).val(),
		};
console.log(userData);
		return userData;
	}

	function successUser () {
		// location.href = `/admin-users`;
	}

	$(`.btn-delete-user`).on(`click`, (event)=> {

		const userDeleteId = event.target.id;
		ajaxTemplate(`/admin-users/${userDeleteId}`, `DELETE`, {}, deleteReload);

	});
	function deleteReload () {
		location.reload();
	}


});
