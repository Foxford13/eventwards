'use strict';

const moment = require(`moment`);
const dateToday = moment().format(`YYYY-MM-DD`);

function xmlTemplateUrl  (pathUrl, priority, date) {
	return `<url>
		<loc>http://localhost:7000${pathUrl}</loc>
		<lastmod>${date}</lastmod>
		<changefreq>daily</changefreq>
		<priority>${priority}</priority>
		</url>`;
}

function setPriorityOfUrl (urlPriority) {

	if (typeof urlPriority === `undefined`) {
		return 0.1;
	}
	else {
		return urlPriority.handle.priority;
	}
}

function composeXml (req, res) {

	// routes is included here due to circular reference btween them and this file
	const routes = require(`../config/routes`); // eslint-disable-line global-require
	const xmlStart = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
	const xmlEnd  = `</urlset>`;
	const urlXmlCollection = [];

	for (var index = 0; index < routes.stack.length; index++) {
		urlXmlCollection.push(
			xmlTemplateUrl(routes.stack[index].route.path, setPriorityOfUrl(routes.stack[index].route.stack[0]), dateToday));
	}

	const outputXml = xmlStart + urlXmlCollection + xmlEnd;

	res.set({
		'content-length': Buffer.byteLength(outputXml),
		'content-type': `text/xml`,
		'Cache-Control': `no-cache, no-store, must-revalidate`,
		'Pragma': `no-cache`,
	});

	return res.end(outputXml);


	// function pullDynamicRoutes (routeBase, documents) {
	// 	const urlXmlDynCollection = [];
	//
	// 	for (let index = 0; index < documents.length; index++) {
	// 		urlXmlDynCollection.push(`<url>
	// 			<loc>http://localhost:7000${routeBase}/${documents[index]._id}</loc>
	// 			<lastmod>${dateToday}</lastmod>
	// 			<changefreq>daily</changefreq>
	// 			<priority>0.1</priority>
	// 			</url>`);
	// 	}
	// 	return urlXmlDynCollection;
	// }
	// const outputXml = xmlStart + urlXmlCollection + urlXmlDynCollection + xmlEnd;
	// const docEvents = await Event.find({ deleted: { $ne: true } }).exec();
	// const eventXml = pullDynamicRoutes(`/events`, docEvents);

}

module.exports = {
	composeXml,
};
