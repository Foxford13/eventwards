'use strict';


const path = require(`path`);
const bodyParser = require(`body-parser`);
const express = require(`express`);
const exphbs  = require(`express-handlebars`);
const mongoose = require(`mongoose`);
const router = require(`../config/routes`);

const {
	selectedHelper,
	removeDivWithEmptyDataHelper
} = require(`../helpers/handlebarHelper`);


const app = express();


mongoose.Promise = global.Promise;

/*
*  use mongoose to connect to database
*/
async function connectDatabase (connectionString) {

	await mongoose.connect(connectionString);

}




/*
*  creates an express app
*/
async function startServer (port) {

	app.use(bodyParser.urlencoded({  // This will let us get the data from a POST.
		extended: true,
	}));
	app.use(bodyParser.json());


	app.engine(`handlebars`, exphbs({
		defaultLayout: `main`,
		layoutsDir: path.join(__dirname, `..`, `..`,`frontend`, `views`, `layouts`),
		partialsDir: [
			path.join(__dirname, `..`, `..`, `frontend`, `views`, `partials`),
			path.join(__dirname, `..`, `..`, `frontend`, `views`, `partials`, `cards`),
			path.join(__dirname, `..`, `..`, `frontend`, `views`, `partials`, `cards`, `admin`),
		],
		helpers: {
			selected: selectedHelper,

		},
	}));

	app.use(`/public`, express.static( path.join(__dirname, `..`, `..`, `frontend`, `build`)));

	app.set(`views`, path.join(__dirname, `..`, `..`, `frontend`, `views`));

	app.set(`view engine`, `handlebars`);
	app.use(router);

	app.use((req, res) => res.render(`errors/404`));

	await new Promise((resolve, reject) =>
		app.listen(port, err => (err ? reject(err) : resolve()))
	);

}

module.exports = {
	connectDatabase,
	startServer,
};
