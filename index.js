// Importing required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// Importing axios
const axios = require("axios");

dotenv.config();

// Setting up Express app
const app = express();
const port = process.env.PORT || 8888;

// Defining important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
// Adding middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define route for the about page
app.get("/", (req, res) => {
  // Rendering the about.pug template
  res.render("about");
});

// Define route for the index page
app.get("/index", (req, res) => {
  // Rendering the about.pug template
  res.render("index");
});

// Route for both APIs and the search function
app.get("/search", async (req, res) => {
  try {
    // Fetching the word from the form
    const word = req.query.word;

    // Creating options for meme API request
    const memeOptions = {
      method: "GET",
      url: "https://humor-jokes-and-memes.p.rapidapi.com/memes/search",
      params: {
        keywords: word,
        "media-type": "image",
        "keywords-in-image": "false",
        "min-rating": "3",
        number: "3",
      },
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "humor-jokes-and-memes.p.rapidapi.com",
      },
    };

    // Making both API requests simultaneously
    const [wordResponse, memeResponse] = await axios.all([
      axios.get(
        `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${process.env.WEBSTER_API_KEY}`
      ),
      axios.request(memeOptions),
    ]);

    const wordData = wordResponse.data;
    const memeData = memeResponse.data;

    // console.log(memeData);

    // Extracting word details
    const shortDef = wordData[0].shortdef;
    const synsList = wordData[0].meta.syns;
    const antList = wordData[0].meta.ants;

    // Extracting the memes details
    const memeUrl = memeData.url;

    // Rendering the index.pug template with both fetched data
    res.render("index", {
      word: word,
      shortDef: shortDef,
      synsList: synsList,
      antsList: antList,
      memeUrl: memeUrl,
    });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Setting up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
