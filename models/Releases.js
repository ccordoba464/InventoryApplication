const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReleasesSchema = new Schema({
  name: { type: String },
  artist: { type: String },
  description: { type: String },
  genre: { type: String },
  price: { type: Number },
  number_in_stock: { type: Number },
});

// Virtual for author's URL
ReleasesSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/releases/${this._id}`;
});

// Export model
module.exports = mongoose.model("releases", ReleasesSchema);
