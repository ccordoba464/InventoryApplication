const express = require("express");
const router = express.Router();

// Require controller modules.
const release_controller = require("../controllers/releaseController");
const genre_controller = require("../controllers/genreController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// RELEASE ROUTES ///

// GET request for creating a Release. NOTE This must come before route that displays Release (uses id).
router.get("/release/create", release_controller.release_create_get);

//POST request for creating Release.
router.post("/release/create", release_controller.release_create_post);

// GET request to delete Release.
router.get("/release/:id/delete", release_controller.release_delete_get);

// POST request to delete Release.
router.post("/release/:id/delete", release_controller.release_delete_post);

// GET request to update Release.
router.get("/release/:id/update", release_controller.release_update_get);

// POST request to update Release.
router.post("/release/:id/update", release_controller.release_update_post);

// GET request for one Release.
router.get("/release/:id", release_controller.release_detail);

// GET request for list of all Release.
router.get("/releases", release_controller.release_list);

module.exports = router;
