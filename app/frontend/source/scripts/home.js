'use strict'; // eslint-disable-line

$(document).ready(() => {  // eslint-disable-line

	function ajaxTemplate (url, type, data, success, dataType) {

		$.ajax({
			url: url,
			async: true,
			type: type,
			data: data,
			dataType: dataType,
			success: success,
			error: function (err) {
				console.log(err);
				$(`.validation-message`).empty().append(`<h1> Fill out the form correctly</h1>`);
			},
		});
	}

	$(`.search-icon`).click(function () {
		$(this).toggleClass(`active`);

		$(`.search-input`).toggleClass(`slideright`);
		$(`.search-input-mobi`).toggleClass(`slideright-mobi`);
	});

	// functions related to slider arrows the move cards
	function slideBoxes (sliderDuration, direction) {

		const $marginOfSlidedElement =
		parseInt($(this).siblings(`.card-list`).children(`.card`).first().css(`margin-right`));

		const $widthOfSlidedElement =
		$(this).siblings(`.card-list`).children(`.card`).first().outerWidth() + $marginOfSlidedElement;

		const $view = $(this).siblings(`.card-list`);
		const currentPosition = $view[0].scrollLeft;
		var curBoxShown;
		var nextBoxToShow;
		var scrollLeft;

		console.log(`$marginOfSlidedElement ` + $marginOfSlidedElement + `, $widthOfSlidedElement ` + $widthOfSlidedElement);
		console.log(`Slider duration ` + sliderDuration + `, direction ` + direction);
		console.log(`currentPosition ` + currentPosition + `, $view ` + $view);

		if (direction === `right`) {

			curBoxShown = ((currentPosition) / $widthOfSlidedElement + 0.01);
			nextBoxToShow = Math.floor(curBoxShown);
			scrollLeft = ((nextBoxToShow * $widthOfSlidedElement) + $widthOfSlidedElement);

			console.log(`curBox ${curBoxShown} nextB ${nextBoxToShow} scroll ${scrollLeft}`);
			console.log(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`);
		}
		else if (direction ===  `left`) {

			curBoxShown = ((currentPosition) / $widthOfSlidedElement - 0.01);
			nextBoxToShow = Math.ceil(curBoxShown);
			scrollLeft = ((nextBoxToShow * $widthOfSlidedElement) - $widthOfSlidedElement);

		}
		$view.animate({ scrollLeft: scrollLeft }, { duration: sliderDuration });
	}

	function disapearingArrows () {

		const $element = $(this);
		const leftScroll = $element[0].scrollLeft;
		const widthScroll = $element[0].scrollWidth;
		const widthOffset = $element[0].offsetWidth;
		const arrowLeft = $element.siblings(`.leftArrow`);
		const arrowRight = $element.siblings(`.rightArrow`);
		const ifExpresstionScroll = (Math.ceil(leftScroll) === (widthScroll - widthOffset));
console.log('dissssss');
		leftScroll > 0 ? arrowLeft.removeClass(`hidden`) : arrowLeft.addClass(`hidden`);
		ifExpresstionScroll ? arrowRight.addClass(`hidden`) : arrowRight.removeClass(`hidden`);
	}

	$(`.card-list`).on(`scroll`, disapearingArrows);


	const $arrows = $(`.leftArrow, .rightArrow`);


	function activateArrows (arrowsArg, source) {
console.log(`here`, source);
		arrowsArg.each((index, element) => {

			const $element = $(element);
			const type = ($element.hasClass(`leftArrow`) ? `left` : `right`);
			$element.on(`click`, slideBoxes.bind($element, 400, type));
		});
	}

	activateArrows($arrows);

	setTimeout(() => {$(`.rightArrow`).each((index, element) => {
		console.log($(element).closest(`.arrow-container`).find(`.card-list`)[0].scrollWidth + 'zzzzz' + $(element).closest(`.arrow-container`).find(`.card-list`).width());

		if ($(element).closest(`.arrow-container`).find(`.card-list`)[0].scrollWidth <= $(element).closest(`.arrow-container`).find(`.card-list`).width()) {
			console.log(`invisible right arrrow!!!!!±!!`);
			$(element).addClass(`hidden`);
		}
	})}, 0);


	/*
	* functions related to popup and its elements
	*/
	const $modal = $(`.modal`);
	const $openPopupSpeaker = $(`.openpop`);
	const $openPopContact = $(`.openpop-con`);
	const $openPopVideo = $(`.openpop-video`);
	const $closePopBtn = $(`.button-close, .close-modal`);

	// template which appends speaker about text so it is split into read more/less sections
	function appendMoreLessText (summaryText, readMoreText, targetDiv) {

		targetDiv.empty();
		const arr = [];
		console.log('appendMoreLessText');

		arr.push((
			`<p class="read-more-wrap">${summaryText}<span class="ellipsis">...</span><span class="read-more-target">${readMoreText}</span><label for="post-1" class="read-more-trigger">more+</label></p>`));

			targetDiv.append(arr);

			const readMoreBtn = $(`.read-more-trigger`);

			readMoreBtn.on(`click`, ()=> {

				$(`.ellipsis`).toggleClass(`hidden-display`);
				$(`span`).toggleClass(`read-more-target`);

				if (readMoreBtn.text() ===  `more+`) {

					readMoreBtn.text(``).text(`less-`);
				}
				else if (readMoreBtn.text() ===  `less-`) {
					readMoreBtn.text(``).text(`more+`);
				}
			});
		}

		function modifyTextOnPop (speakerId, data) {

			setTimeout(() => { activateArrows($(`.modal .leftArrow, .modal .rightArrow`)); }, 0);

			$(`#modalID${speakerId} .modal-content`).html(data);
			readMore($(`.bio-speaker`));
console.log('we work');


			$(`.card-list`).on(`scroll`, disapearingArrows);
			$(`.close-modal`).on(`click`, closeModal);
		}


		// open and close the popup itself and sends request
		$openPopupSpeaker.on(`click`, (event)=> {

			const speakerId = event.target.closest(`.openpop`).id.replace( /^\D+/g, ``);
			console.log('i fucking work');
			$(`#modalID${speakerId}`).css(`display`, `block`);
			ajaxTemplate(`/speaker/${speakerId}/false`, `GET`, {}, modifyTextOnPop.bind(null, speakerId), `html`);
			$(`.read-more-trigger`).text(`works`);
		});

		/*
		* puts data into the popup window
		*/


		$openPopContact.on(`click`, () => {

			$(`#openpop-con-id`).css(`display`, `block`);
			ajaxTemplate(`/contact/false`, `GET`, {}, appendConData, `html`);
			$(`.read-more-trigger`).text(`works`);
		});

		$('.contact-organiser-btn').on(`click`, () => {

			$(`#openpop-con-id`).css(`display`, `block`);
			ajaxTemplate(`/contact/false`, `GET`, {}, appendConData, `html`);
			$(`.read-more-trigger`).text(`works`);
		});

		$openPopVideo.on(`click`, (event) => {

			const videoId = event.target.closest(`.openpop-video`).id.replace(/^\D+/g, ``);

			$(`#modalID${videoId}`).css(`display`, `block`);
			ajaxTemplate(`/video/${videoId}/false`, `GET`, {}, appendVidData.bind(null, videoId), `html`);
		});

		function closeModal () {
			$modal.css(`display`, `none`);
			$(`.modal-content`).html(``);
		}

		function appendConData (data) {

			$(`#openpop-con-id .modal-content`).html(data);
			$(`.contact-form`).on(`submit`, submitContactDetails);
			$(`.close-modal`).on(`click`, closeModal);
		}

		function appendVidData (videoId, data) {
			setTimeout(() => { activateArrows($(`.modal .leftArrow, .modal .rightArrow`)); }, 0);

			$(`#modalID${videoId} .modal-content`).html(data);
						$(`.card-list`).on(`scroll`, disapearingArrows);
			$(`.close-modal`).on(`click`, closeModal);
		}

		$closePopBtn.on(`click`, closeModal);

		// splits the speaker about section so it can be divided into readmore less/
		function readMore (targetDiv) {

			const text = targetDiv.html();

			let summaryText;
			let readMoreText;

			if (text.length > 100) {
				summaryText = (text.substr(0, text.lastIndexOf(` `, 117)));
				readMoreText = text.substr(120);
			}
		else {
			summaryText = text;
			return targetDiv.text(text);

		}

		appendMoreLessText(summaryText, readMoreText, targetDiv);
	}
	/*
	* if statements for the read more section button to work accordingly with the
	* available space on the page
	*/

		if ($(`.bio-speaker`).length > 0) {
			readMore($(`.bio-speaker`));
		}

		if ($(`.contact-form`).length > 0) {
			$(`.contact-form`).on(`submit`, submitContactDetails);
		}

		$(`.takeaways-trigger`).on(`click`, () => {
			$(`.takeaways`).toggleClass(`hidden-display`);
		});


		function appendErrorFormVal (data) {
			console.log(data);
			if (data.success === false) {
				$(`.validation-message`).empty().append(
					`	<div class="error-message message "><i class="fa fa-exclamation-triangle" aria-hidden="true">
					</i>Please fill out the form correctly<span><i class="fa fa-times" aria-hidden="true"></i></span>
					</div>`);
				}
				else {
					$(`.validation-message`).empty().append(
						`<div class="success-message message ">
						<i class="fa fa-check" aria-hidden="true"></i>Your message has been sent<span>
						<i class="fa fa-times" aria-hidden="true"></i>
						</span></div>`);
					}
					$(`.fa-times`).on(`click`, () => {
						$(`.fa-times`).closest(`.message`).addClass(`hidden`);
					});
				}

				function submitContactDetails (event) {

		

				event.preventDefault();

				const postContact = {
					fullName: $(`.form-name`).val(),
					email: $(`.form-email`).val(),
					subject: $(`.subject-inquiry`).val(),
					text: $(`.contact-text`).val(),
				};

					if ($(`.contact-organizer-id`).val() && $(`.contact-organizer-id`).val().length > 10) {

						postContact.organiserId = $(`.contact-organizer-id`).val();
					}
					console.log(postContact);
					ajaxTemplate(`/contact-receiver`, `POST`, postContact, appendErrorFormVal, `json`);

					$(`.fa-times`).on(`click`, () => {
						$(`.fa-times`).closest(`.message`).addClass(`hidden`);
					});
				}

				if ($(`.widgets`).length > 0) {

					var exampleCallback = function () {
						console.log(`Order complete!`);
					};

					window.EBWidgets.createWidget({
						widgetType: `checkout`,
						eventId: `40706947576`,
						modal: true,
						modalTriggerElementId: `eventbrite-widget-modal-trigger-40706947576`,
						onOrderComplete: exampleCallback,
					});
				}

				$(`.search-bar-main`).on(`submit`, (event) => {
					console.log('i work!!!!!!');
					event.preventDefault();

		const searchData = encodeURIComponent($(event.target).find(`input`).val()) ;
if (!searchData) { return; }
		location.href = `/?keywords=${searchData}`;
	});

	(function(d, s, id) {
		console.log('FB works');
		var js, fjs = d.getElementsByTagName(s)[0];

		if (d.getElementById(id)) return;

		js = d.createElement(s); js.id = id;
		js.src = `https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.11&appId=128552891074234`;
		fjs.parentNode.insertBefore(js, fjs);
	}(document, `script`, `facebook-jssdk`));

	setTimeout(() => {
		$(`.rightArrow`).each((index, element) => {

			if ($(element).closest(`.arrow-container`).find(`.card-list`)[0].scrollWidth <= $(element).closest(`.arrow-container`).find(`.card-list`).width()) {
				console.log(`invisible right arrrow!!!!!±!!`);
				$(element).addClass(`hidden`);
			}
		});
	}, 0);

				module.exports = {
					slideBoxes,
					disapearingArrows,
					ajaxTemplate,
					appendErrorFormVal,
				};

			});
