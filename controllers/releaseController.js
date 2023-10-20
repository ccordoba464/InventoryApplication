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
  res.send("NOT IMPLEMENTED: Release create GET");
});

// Handle Release create on POST.
exports.release_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Release create GET");
});

// Display Release delete form on GET.
exports.release_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Release delete GET");
});

// Handle Release delete on POST.
exports.release_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Release delete POST");
});

// Display Release update form on GET.
exports.release_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Release update GET");
});

// Handle Release update on POST.
exports.release_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Release update POST");
});
