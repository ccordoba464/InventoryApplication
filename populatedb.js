#! /usr/bin/env node

console.log(
  'This script populates some releases and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Genre = require("./models/Genres");
const Release = require("./models/Releases");

const Genres = [];
const Releases = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createReleases();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name, description) {
  const genre = new Genre({ name: name, description: description });
  await genre.save();
  Genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function releaseCreate(
  index,
  name,
  artist,
  description,
  genre,
  price,
  stockNum
) {
  const releasedetail = {
    name: name,
    artist: artist,
    description: description,
    genre: genre,
    price: price,
    number_in_stock: stockNum,
  };

  const release = new Release(releasedetail);

  await release.save();
  Releases[index] = release;
  console.log(`Added release: ${name}`);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(
      0,
      "Hip Hop / Rap",
      "Hip-hop and rap are urban music genres that originated in the Bronx, New York, during the 1970s, reflecting the experiences of African American and Latino youth. Characterized by rhythmic, rhyming speech, known as rapping, these genres incorporate diverse musical elements, beats, and samples. Hip-hop culture includes elements like breakdancing and graffiti art, contributing to its overall aesthetic. Subgenres like gangsta rap, conscious rap, and trap have emerged, each with distinct themes and styles. Hip-hop has had a significant cultural impact, providing a platform for marginalized voices and influencing fashion and language. It continues to evolve, blending with other musical styles while retaining its core values of self-expression and cultural identity."
    ),
    genreCreate(
      1,
      "Alternative",
      "Alternative music is a diverse and non-mainstream genre that defies easy categorization. It emerged as a counter to more commercial music and often features unconventional or experimental elements. Characterized by its independence and innovation, alternative music encompasses a wide range of styles, from indie rock to electronic and beyond. Lyrics often explore introspective or abstract themes. The genre has a dedicated and passionate fan base and is known for nurturing underground and emerging artists. Alternative music continually evolves and fosters unique and creative expressions in the music world, making it a captivating and ever-evolving musical realm."
    ),
    genreCreate(
      2,
      "Pop",
      "Pop music is a popular and mainstream musical genre known for its catchy melodies, accessible lyrics, and broad appeal. It typically incorporates elements from various music styles and often features clear, memorable hooks. Pop songs frequently address themes of love, relationships, and everyday life. This genre has a strong emphasis on production and is known for its chart-topping hits and widespread radio play, making it a dominant force in the music industry. Pop music's ever-evolving sound reflects contemporary tastes and trends, making it a dynamic and influential cultural phenomenon."
    ),
  ]);
}

async function createReleases() {
  console.log("Adding releases");
  await Promise.all([
    releaseCreate(
      0,
      "CALCULATED",
      "Vowel Gang",
      "Vowel Gang's first LP.",
      Genres[0],
      9.99,
      10
    ),
    releaseCreate(
      1,
      "Vowel Volumes I",
      "Vowel Gang",
      "Vowel Gang's first group mixtape.",
      Genres[0],
      9.99,
      5
    ),
    releaseCreate(
      2,
      "444",
      "Rimbo",
      "Rimbo's first alternative project",
      Genres[1],
      9.99,
      4
    ),
  ]);
}
