'use strict';

const path = require(`path`);

const mongoose = require(`mongoose`);
const User = require(`../models/user`);
const Article = require(`../models/article`);
const Video = require(`../models/video`);
const Hub = require(`../models/hub`);
const Event = require(`../models/event`);

const { connectDatabase } = require(`../modules/startup`);
const config = require(`config-ninja`).init(`eventwards-website`, path.join(__dirname, `..`, `config`));

mongoose.Promise = global.Promise;
connectDatabase(config.database.connectionString);

try {
	User.collection.drop();
	Article.collection.drop();
	Video.collection.drop();
	Hub.collection.drop();
	Event.collection.drop();
}
catch(err) {
	console.log(err);
}

User
.create([{
	_id: `5a1bfbffc867ff0f4fe0d682`,
	fullName: `DobbyTwo`,
	profession: `Former living house elf`,
	imageUrl: `https://i.imgflip.com/vm54f.jpg`,
	location: `Hell`,
	contact: `Oujia board`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
	events: `banger alert`,


},
{
	fullName: `Putin`,
	profession: `Bear trainer`,
	imageUrl:
	`https://upload.wikimedia.org/wikipedia/commons/9/98/Vladimir_Putin_%282017-07-08%29.jpg`,
	location: `Hogwarts`,
	contact: `Use pentagram`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Vladimir Vladimirovich Putin (/ˈpuːtɪn/; Russian: Влади́мир Влади́мирович Пу́тин, IPA: [vɫɐˈdʲimʲɪr vɫɐˈdʲimʲɪrəvʲɪtɕ ˈputʲɪn] (About this sound listen); born 7 October 1952) is a Russian statesman serving as the current President of Russia since 7 May 2012, previously holding the position from 2000 to 2008.[2][3][4] He was Prime Minister from 1999 to 2000, and again from 2008 to 2012.[5] During his second term as Prime Minister, he was the chairman of the ruling United Russia party.[2]`,
	events: `banger alert`,
},
{
	fullName: `Putin`,
	profession: `Bear trainer`,
	imageUrl:
	`https://upload.wikimedia.org/wikipedia/commons/9/98/Vladimir_Putin_%282017-07-08%29.jpg`,
	location: `Hogwarts`,
	contact: `Use pentagram`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Vladimir Vladimirovich Putin (/ˈpuːtɪn/; Russian: Влади́мир Влади́мирович Пу́тин, IPA: [vɫɐˈdʲimʲɪr vɫɐˈdʲimʲɪrəvʲɪtɕ ˈputʲɪn] (About this sound listen); born 7 October 1952) is a Russian statesman serving as the current President of Russia since 7 May 2012, previously holding the position from 2000 to 2008.[2][3][4] He was Prime Minister from 1999 to 2000, and again from 2008 to 2012.[5] During his second term as Prime Minister, he was the chairman of the ruling United Russia party.[2]`,
	events: `banger alert`,
},
{
	fullName: `Putin`,
	profession: `Bear trainer`,
	imageUrl:
	`https://upload.wikimedia.org/wikipedia/commons/9/98/Vladimir_Putin_%282017-07-08%29.jpg`,
	location: `Hogwarts`,
	contact: `Use pentagram`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Vladimir Vladimirovich Putin (/ˈpuːtɪn/; Russian: Влади́мир Влади́мирович Пу́тин, IPA: [vɫɐˈdʲimʲɪr vɫɐˈdʲimʲɪrəvʲɪtɕ ˈputʲɪn] (About this sound listen); born 7 October 1952) is a Russian statesman serving as the current President of Russia since 7 May 2012, previously holding the position from 2000 to 2008.[2][3][4] He was Prime Minister from 1999 to 2000, and again from 2008 to 2012.[5] During his second term as Prime Minister, he was the chairman of the ruling United Russia party.[2]`,
	events: `banger alert`,
},
{
	fullName: `Putin`,
	profession: `Bear trainer`,
	imageUrl:
	`https://upload.wikimedia.org/wikipedia/commons/9/98/Vladimir_Putin_%282017-07-08%29.jpg`,
	location: `Hogwarts`,
	contact: `Use pentagram`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Vladimir Vladimirovich Putin (/ˈpuːtɪn/; Russian: Влади́мир Влади́мирович Пу́тин, IPA: [vɫɐˈdʲimʲɪr vɫɐˈdʲimʲɪrəvʲɪtɕ ˈputʲɪn] (About this sound listen); born 7 October 1952) is a Russian statesman serving as the current President of Russia since 7 May 2012, previously holding the position from 2000 to 2008.[2][3][4] He was Prime Minister from 1999 to 2000, and again from 2008 to 2012.[5] During his second term as Prime Minister, he was the chairman of the ruling United Russia party.[2]`,
	events: `banger alert`,
},
{
	fullName: `Putin`,
	profession: `Bear trainer`,
	imageUrl:
	`https://upload.wikimedia.org/wikipedia/commons/9/98/Vladimir_Putin_%282017-07-08%29.jpg`,
	location: `Hogwarts`,
	contact: `Use pentagram`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Vladimir Vladimirovich Putin (/ˈpuːtɪn/; Russian: Влади́мир Влади́мирович Пу́тин, IPA: [vɫɐˈdʲimʲɪr vɫɐˈdʲimʲɪrəvʲɪtɕ ˈputʲɪn] (About this sound listen); born 7 October 1952) is a Russian statesman serving as the current President of Russia since 7 May 2012, previously holding the position from 2000 to 2008.[2][3][4] He was Prime Minister from 1999 to 2000, and again from 2008 to 2012.[5] During his second term as Prime Minister, he was the chairman of the ruling United Russia party.[2]`,
	events: `banger alert`,
},
{
	fullName: `Hulk`,
	profession: `aaaaarghhhhh`,
	imageUrl: `https://i.ytimg.com/vi/hQMtZL7y18U/maxresdefault.jpg`,
	location: `Hell`,
	contact: `Oujia board`,
	organisation: `Hogwarts`,
	nationality: `ROOOOOAAAAAR!!!!!!`,
	events: `banger alert`,

	bio: `The Hulk is a fictional superhero appearing in American comic books published by Marvel Comics. Created by writer Stan Lee and artist Jack Kirby, the character first appeared in the debut issue of The Incredible Hulk (May 1962). In his comic book appearances, the character is both the Hulk, a green-skinned, hulking and muscular humanoid possessing a vast degree of physical strength, and his alter ego Bruce Banner, a physically weak, socially withdrawn, and emotionally reserved physicist, the two existing as personalities independent and resenting of the other.`,
},
{
	fullName: `DobbyTwo`,
	profession: `Former living house elf`,
	imageUrl: `https://i.imgflip.com/vm54f.jpg`,
	location: `Hell`,
	contact: `Oujia board`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
	events: `banger alert`,

},
{
	fullName: `DobbyTwo`,
	profession: `Former living house elf`,
	imageUrl: `https://i.imgflip.com/vm54f.jpg`,
	location: `Hell`,
	contact: `Oujia board`,
	organisation: `Hogwarts`,
	nationality: `http://www.senojflags.com/imageUrls/national-flags/Japan-Flag.gif`,
	bio: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
	events: `banger alert`,

}])
.then((users) => {
	console.log(`${users.length} users created`);
	return Article
	.create([{
		title: `1`,
		url: `https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg`,

	},{
		title: `2`,
		url: `https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg`,

	},{
		title: `3`,
		url: `https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg`,

	},{
		title: `4`,
		url: `https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg`,

	},{
		title: `5`,
		url: `https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg`,

	},{
		title: `6`,
		url: `https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg`,

	},{
		title: `7`,
		url: `https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg`,
	}])
	.then((articles) => {
		console.log(`${articles.length} articles created`);
		return Video
		.create([{
			title: `Terminator`,
			url: `https://www.youtube.com/embed/XGSy3_Czz8k`,
			duration: 120,
			_speakers: [`5a1bfbffc867ff0f4fe0d682`]

		},{
			title: `Terminator1`,
			url: `https://www.youtube.com/embed/XGSy3_Czz8k`,
			duration: 120,
			_speakers: [`5a1bfbffc867ff0f4fe0d682`]

		},{
			title: `Terminator2`,
			url: `https://www.youtube.com/embed/XGSy3_Czz8k`,
			duration: 120,
			_speakers: [`5a1bfbffc867ff0f4fe0d682`]

		},{
			title: `Terminator3`,
			url: `https://www.youtube.com/embed/XGSy3_Czz8k`,
			duration: 120,
			_speakers: [`5a1bfbffc867ff0f4fe0d682`]

		},{
			title: `Terminator4`,
			url: `https://www.youtube.com/embed/XGSy3_Czz8k`,
			duration: 120,
			_speakers: [`5a1bfbffc867ff0f4fe0d682`]

		},{
			title: `Terminator5`,
			url: `https://www.youtube.com/embed/XGSy3_Czz8k`,
			duration: 120,
			_speakers: [`5a1bfbffc867ff0f4fe0d682`]

		},{
			title: `Terminator6`,
			url: `https://www.youtube.com/embed/XGSy3_Czz8k`,
			duration: 120,
			_speakers: [`5a1bfbffc867ff0f4fe0d682`]
		}])
		.then((articles) => {
			console.log(`${articles.length} articles created`);
			return Hub
			.create([
				{
					name: `Machine Learning`,
					slug: `http://mb.cision.com/Public/616/2008263/95b9fb0248ad606f_800x800ar.jpg`,
				},
				{
					name: `Chatbots`,
					slug: `https://i.ytimg.com/vi/7PLd--5vMiU/maxresdefault.jpg`,
				},
				{
					name: `Weasels and Rodents`,
					slug: `https://i.pinimg.com/originals/ec/38/b1/ec38b1f565abd74743287ad50cc28827.png`,
				},
				{
					name: `Otters & modern world`,
					slug: `https://media1.popsugar-assets.com/files/thumbor/RIMHzovaUzDm3PrYdTuyVPNZFLs/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2016/12/08/780/n/1922507/cdb79475fafc725c_MCDHAP2_EC254_H.JPG`,
				},
				{
					name: `Chatbots`,
					slug: `https://i.ytimg.com/vi/7PLd--5vMiU/maxresdefault.jpg`,
				},
				{
					name: `Weasels and Rodents`,
					slug: `https://i.pinimg.com/originals/ec/38/b1/ec38b1f565abd74743287ad50cc28827.png`,
				},
				{
					name: `Otters & modern world`,
					slug: `https://media1.popsugar-assets.com/files/thumbor/RIMHzovaUzDm3PrYdTuyVPNZFLs/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2016/12/08/780/n/1922507/cdb79475fafc725c_MCDHAP2_EC254_H.JPG`,
				},
				{
					name: `Chatbots`,
					slug: `https://i.ytimg.com/vi/7PLd--5vMiU/maxresdefault.jpg`,
				},
				{
					name: `Weasels and Rodents`,
					slug: `https://i.pinimg.com/originals/ec/38/b1/ec38b1f565abd74743287ad50cc28827.png`,
				},
				{
					name: `Otters & modern world`,
					slug: `https://media1.popsugar-assets.com/files/thumbor/RIMHzovaUzDm3PrYdTuyVPNZFLs/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2016/12/08/780/n/1922507/cdb79475fafc725c_MCDHAP2_EC254_H.JPG`,
				},
				{
					name: `Cybernetics`,
					slug: `http://cdn.collider.com/wp-content/uploads/harry-potter-and-the-deathly-hallows-part-2-image-3.jpg`,
				},
			])
			.then((articles) => {
				console.log(`${articles.length} articles created`);
				return Event
				.create([
					{
						name: `Quiditch match`,
						location: `London, UK`,
						eventDate: {
							start: 12-12-2017,
							finish: 11-12-2017,
						},
						about: `Lorem dsfadfdsadfasdfasdf asdfsdfasdfdsfadsfadsfasdfasdfsadfadfadsfadsf adsfadsfasdfasdfadsfasdfsadfadfasdfadfas dfasdfasdfasdfasdfasdfasdfadsf`,
						imageFileName: `http://www.fillmurray.com/350/200`,
					},
					{
						name: `Hermiones secret`,
						location: `Helsinki, Finland  ahahahahaahahh hahaahahahahah`,
						eventDate: {
							start: 12-12-2017,
							finish: 11-12-2017,
						},
						about: `Lorem dsfadfdsadfasdfasdf asdfsdfasdfdsfadsfadsfasdfasdfsadfadfadsfadsf adsfadsfasdfasdfadsfasdfsadfadfasdfadfas dfasdfasdfasdfasdfasdfasdfadsf`,
						imageFileName: `http://www.fillmurray.com/350/200`,
					},
					{
						name: `Rons secret`,
						location: `Hogwarts`,
						eventDate: {
							start: 12-12-2017,
							finish: 11-12-2017,
						},
						about: `Lorem dsfadfdsadfasdfasdf asdfsdfasdfdsfadsfadsfasdfasdfsadfadfadsfadsf adsfadsfasdfasdfadsfasdfsadfadfasdfadfas dfasdfasdfasdfasdfasdfasdfadsf`,
						imageFileName: `http://www.fillmurray.com/300/200`,
					},
					{
						name: `Coincidence`,
						location: `With a T! ahahahahaahahh hahaahahahahah`,
						eventDate: {
							start: 12-12-2017,
							finish: 11-12-2017,
						},
						about: `Lorem dsfadfdsadfasdfasdf asdfsdfasdfdsfadsfadsfasdfasdfsadfadfadsfadsf adsfadsfasdfasdfadsfasdfsadfadfasdfadfas dfasdfasdfasdfasdfasdfasdfadsf`,
						imageFileName: `http://www.fillmurray.com/200/200`,
					},
					{
						name: `I THINK NOT  ahahahahaahahh hahaahahahahah`,
						location: `Neverland  ahahahahaahahh hahaahahahahah`,
						eventDate: {
							start: 12-12-2017,
							finish: 11-12-2017,
						},
						about: `Lorem dsfadfdsadfasdfasdf asdfsdfasdfdsfadsfadsfasdfasdfsadfadfadsfadsf adsfadsfasdfasdfadsfasdfsadfadfasdfadfas dfasdfasdfasdfasdfasdfasdfadsf`,
						imageFileName: `http://www.fillmurray.com/250/200`,
					},
				])
			})
		})
	})
	.then((videos) => {
		console.log(`${videos.length} videos created`);
	})
})
.catch((err) => console.log(err));
