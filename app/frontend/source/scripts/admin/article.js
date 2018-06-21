'use strict';

$(document).ready(() => {
	const {
		ajaxTemplate,
	} = require(`../home`);

	function successArticle () {

		// location.href = `/admin-articles`;

	}

	$(`.new-article`).on(`submit`, (article) => {
		article.preventDefault();

		ajaxTemplate(`/admin-articles/new`, `POST`, newArticleData($(`.new-article`)), successArticle, `json`);
	});

	$(`.edit-article`).on(`submit`, (article) => {

		article.preventDefault();

		const articleId = $(`#edit-article-id`).val();

		ajaxTemplate(`/admin-articles/${articleId}/edit`, `PUT`, newArticleData($(`.edit-article`)), successArticle, `json`);
	});

	function newArticleData (targetForm) {

		const articleData = {
			title: targetForm.find(`input[name='title']`).val(),
			url: targetForm.find(`input[name='url']`).val(),
			imageUrl: targetForm.find(`input[name='imageUrl']`).val(),
		};

		return articleData;
	}

	$(`.btn-delete-article`).on(`click`, (article) => {

		const articleDeleteId = article.target.id;
		ajaxTemplate(`/admin-articles/${articleDeleteId}`, `DELETE`, {}, deleteReload);

	});
	function deleteReload () {
		location.reload();
	}

});
