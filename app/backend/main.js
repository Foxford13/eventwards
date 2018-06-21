'use strict';

/*
* MAIN ENTRY POINT
*/

const path = require(`path`);
const config = require(`config-ninja`).init(`eventwards-website`, path.join(__dirname, `config`));
const { connectDatabase, startServer } = require(`./modules/startup`);



async function main () {

	await connectDatabase(config.database.connectionString);

	await startServer(config.server.port);

}





main().catch(err => console.error(err));
