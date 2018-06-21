'use strict';

$(document).ready(() => {
	const {
		ajaxTemplate,
	} = require(`../home`);


	$(`.edit-customize`).on(`submit`, (customize) => {

		customize.preventDefault();

		const customizeId = $(`#edit-customize-id`).val();

	ajaxTemplate(`/customize-page/edit`, `PUT`, newCustomizeData($(`.edit-customize`)), successCustomize, `json`);
	});

	function newCustomizeData (targetForm) {

		const customizeData = {
			mainPageImageUrl: targetForm.find(`input[name='mainPageImageUrl']`).val(),
			aboutCompany: targetForm.find(`textarea[name='aboutCompany']`).val(),

		};

console.log(customizeData);
		return customizeData;
	}

	function successCustomize () {
		// location.href = `/customize-page`;
		console.log('success');

	}

	$(`.btn-delete-customize`).on(`click`, (customize) => {

		const customizeDeleteId = customize.target.id;
		ajaxTemplate(`/admin-customizes/${customizeDeleteId}`, `DELETE`, {}, deleteReload);

	});
	function deleteReload () {
		location.reload();
	}

});
