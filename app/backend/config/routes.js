'use strict';

const router = require(`express`).Router();

const {
	pricingIndex,
	videoView,
	titoView,
	contactReceiver,
	eventShow,
	homeView,
	speakerShow,
	contactIndex,
	usersIndex,
} = require(`../controllers/home`);

const {
	adminVideosIndex,
	adminVideoCreate,
	adminVideoNew,
	adminVideoEdit,
	adminVideoUpdate,
	adminVideoDelete,
} = require(`../controllers/admin/video`);

const {
	adminEventsIndex,
	adminEventCreate,
	adminEventNew,
	adminEventEdit,
	adminEventUpdate,
	adminEventDelete,
	adminSessionDelete,
} = require(`../controllers/admin/event`);

const {
	adminUsersIndex,
	adminUserCreate,
	adminUserNew,
	adminUserEdit,
	adminUserUpdate,
	adminUserDelete,
} = require(`../controllers/admin/user`);

const {
	adminArticlesIndex,
	adminArticleCreate,
	adminArticleNew,
	adminArticleEdit,
	adminArticleUpdate,
	adminArticleDelete,
} = require(`../controllers/admin/article`);

const {
	adminTagsIndex,
	adminTagCreate,
	adminTagNew,
	adminTagEdit,
	adminTagUpdate,
	adminTagDelete,
} = require(`../controllers/admin/tag`);

const {
	adminHubsIndex,
	adminHubCreate,
	adminHubNew,
	adminHubEdit,
	adminHubUpdate,
	adminHubDelete,
} = require(`../controllers/admin/hub`);

const {
	customizePageIndex,
	customizePageEdit,
	customizePageUpdate,
} = require(`../controllers/admin/customize`);

const sitemap = require(`../controllers/sitemap`);

router.route(`/health-check`).get((req, res) => res.json({ healthy: true }));

router.route(`/`)
	.get(homeView);

router.route(`/speaker/:id/:noLayout?`)
	.get(speakerShow);

router.route(`/video/:id/:noLayout?`)
	.get(videoView);

router.route(`/pricing`)
	.get(pricingIndex);

router.route(`/event/:id`)
	.get(eventShow);

router.route(`/tito`)
	.get(titoView);

router.route(`/users-index`)
	.get(usersIndex);

/*
*   admin routes
*/
router.route(`/customize-page`)
	.get(customizePageIndex);

router.route(`/customize-page/edit`)
	.get(customizePageEdit)
	.put(customizePageUpdate);

/*
*    Videos
*/

router.route(`/admin-videos`)
	.get(adminVideosIndex);

router.route(`/admin-videos/new`)
	.get(adminVideoNew)
	.post(adminVideoCreate);

router.route(`/admin-videos/:id/edit`)
	.get(adminVideoEdit)
	.put(adminVideoUpdate);

router.route(`/admin-videos/:id`)
	.delete(adminVideoDelete);

/*
*   Events
*/
router.route(`/admin-events`)
	.get(adminEventsIndex);

router.route(`/admin-events/new`)
	.get(adminEventNew)
	.post(adminEventCreate);

router.route(`/admin-events/:id/edit`)
	.get(adminEventEdit)
	.put(adminEventUpdate);

router.route(`/admin-events/:id`)
	.delete(adminEventDelete);

router.route(`/admin-sessions/:id`)
	.delete(adminSessionDelete);
/*
*   Users
*/
router.route(`/admin-users`)
	.get(adminUsersIndex);

router.route(`/admin-users/new`)
	.get(adminUserNew)
	.post(adminUserCreate);

router.route(`/admin-users/:id/edit`)
	.get(adminUserEdit)
	.put(adminUserUpdate);

router.route(`/admin-users/:id`)
	.delete(adminUserDelete);

/*
*   Article
*/
router.route(`/admin-articles`)
	.get(adminArticlesIndex);

router.route(`/admin-articles/new`)
	.get(adminArticleNew)
	.post(adminArticleCreate);

router.route(`/admin-articles/:id/edit`)
	.get(adminArticleEdit)
	.put(adminArticleUpdate);

router.route(`/admin-articles/:id`)
	.delete(adminArticleDelete);

/*
*   Tag
*/

router.route(`/admin-tags`)
	.get(adminTagsIndex);

router.route(`/admin-tags/new`)
	.get(adminTagNew)
	.post(adminTagCreate);

router.route(`/admin-tags/:id/edit`)
	.get(adminTagEdit)
	.put(adminTagUpdate);

router.route(`/admin-tags/:id`)
	.delete(adminTagDelete);

/*
*   Hub
*/
router.route(`/admin-hubs`)
	.get(adminHubsIndex);

router.route(`/admin-hubs/new`)
	.get(adminHubNew)
	.post(adminHubCreate);

router.route(`/admin-hubs/:id/edit`)
	.get(adminHubEdit)
	.put(adminHubUpdate);

router.route(`/admin-hubs/:id`)
	.delete(adminHubDelete);

/*
*   Contact
*/
router.route(`/contact/:noLayout?`)
	.get(contactIndex);

router.route(`/contact-receiver`)
	.post(contactReceiver);

router.route(`/sitemap.xml`)
	.get(sitemap.composeXml);

module.exports = router;
