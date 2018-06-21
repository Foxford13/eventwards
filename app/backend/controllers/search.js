'use strict';

async function searchReferenced (array, collection, parentReference, otherTable) {

	let referencedCollectionObj;
	const resultSearchArray = [];
	try {
		await Promise.all(array.map(async (queryString) => {

			referencedCollectionObj = await collection.aggregate([
				{
					$match: {
						$text: { $search: queryString },
					},
				},
				{ $sort: { score: { $meta: `textScore` } } },
				{
					$lookup: {
						from: otherTable,
						localField: `_id`,
						foreignField: `${parentReference}`,
						as: `dataCollection`,
					},
				},
				{ $unwind: `$dataCollection` },
			]).exec();
		}));

		for (let index = 0; index < referencedCollectionObj.length; index++) {
			resultSearchArray.push(referencedCollectionObj[index].dataCollection);
		}
	}
	catch (err) {
		console.log(err);
	}

	return resultSearchArray;
}

module.exports = {
	searchReferenced,
};
