const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenresSchema = new Schema({
  name: { type: String },
  description: { type: String },
});

// Virtual for author's URL
GenresSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/genres/${this._id}`;
});

// Export model
module.exports = mongoose.model("Genres", GenresSchema);
