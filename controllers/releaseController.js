const Genre = require("../models/Genres");
const Release = require("../models/Releases");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Releases.
exports.release_list = asyncHandler(async (req, res, next) => {
  const allReleases = await Release.find()
    .sort({ name: 1 })
    .populate("genre")
    .exec();
  res.render("release_list", {
    title: "Release List",
    release_list: allReleases,
  });
});

// Display detail page for a specific release.
exports.release_detail = asyncHandler(async (req, res, next) => {
  const release = await Release.findById(req.params.id)
    .populate("genre")
    .exec();

  if (release === null) {
    const err = new Error("Release not found");
    err.status = 404;
    return next(err);
  }

  res.render("release_detail", {
    title: release.title,
    release: release,
  });
});

// Display Release create form on GET.
exports.release_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const allGenres = await Genre.find().exec();

  res.render("release_form", {
    title: "Create Release",
    genres: allGenres,
  });
});

// Handle Release create on POST.
exports.release_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate and sanitize the name field.
  body("name").trim().isLength({ min: 1 }).escape(),
  body("artist").trim().isLength({ min: 1 }).escape(),
  body("description").trim().isLength({ min: 1 }).escape(),
  body("genre").escape(),
  body("price").trim().escape(),
  body("numStock").trim().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const release = new Release({
      name: req.body.name,
      artist: req.body.artist,
      description: req.body.description,
      genre: req.body.genre,
      price: req.body.price,
      number_in_stock: req.body.numStock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      // Mark our selected genres as checked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render("release_form", {
        title: "Create Release",
        name: release.name,
        artist: release.artist,
        description: release.description,
        genre: release.genre,
        price: release.price,
        number_in_stock: release.numStock,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const releaseExists = await Release.findOne({
        name: req.body.name,
        artist: req.body.artist,
        description: req.body.description,
        genre: req.body.genre,
        price: req.body.price,
        number_in_stock: req.body.numStock,
      }).exec();
      if (releaseExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(releaseExists.url);
      } else {
        await release.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(release.url);
      }
    }
  }),
];

// Display Release delete form on GET.
exports.release_delete_get = asyncHandler(async (req, res, next) => {
  const release = await Release.findById(req.params.id).exec();

  if (release === null) {
    res.redirect("/release");
  }

  res.render("release_delete", {
    title: "Delete Release",
    release: release,
  });
});

// Handle Release delete on POST.
exports.release_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  await Release.findByIdAndRemove(req.body.releaseid);
  res.redirect("/release");
});

// Display Release update form on GET.
exports.release_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const [release, allGenres] = await Promise.all([
    Release.findById(req.params.id).populate("genre").exec(),
    Genre.find().exec(),
  ]);

  if (release === null) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as checked.
  for (const genre of allGenres) {
    for (const release_g of release.genre) {
      if (genre._id.toString() === release_g._id.toString()) {
        genre.checked = "true";
      }
    }
  }

  res.render("release_form", {
    title: "Update Release",
    release: release,
    genres: allGenres,
  });
});

// Handle Release update on POST.
exports.release_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate and sanitize fields.
  body("name").trim().isLength({ min: 1 }).escape(),
  body("artist").trim().isLength({ min: 1 }).escape(),
  body("description").trim().isLength({ min: 1 }).escape(),
  body("genre").escape(),
  body("price").trim().escape(),
  body("numStock").trim().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Release object with escaped/trimmed data and old id.
    const release = new Release({
      name: req.body.name,
      artist: req.body.artist,
      description: req.body.description,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      price: req.body.price,
      number_in_stock: req.body.numStock,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      const allGenres = await Genre.find().exec();

      // Mark our selected genres as checked.
      for (const genre of allGenres) {
        if (release.genre.indexOf(genre._id) > -1) {
          genre.checked = "true";
        }
      }
      res.render("book_form", {
        title: "Update Book",
        genres: allGenres,
        release: release,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedRelease = await Release.findByIdAndUpdate(
        req.params.id,
        release,
        {}
      );
      // Redirect to release detail page.
      res.redirect(updatedRelease.url);
    }
  }),
];
