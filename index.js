const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/links", { useNewUrlParser: true });

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  click: { type: Number, default: 0 },
});

const Link = mongoose.model("Link", linkSchema); // it represents the collection (starts with capital letter)

let link = new Link({
  title: "Guilherme",
  description: "Link to my Github",
  url: "https://github.com/guifaxina",
});

let db = mongoose.connection;
db.on("err", () => {
  console.log("Something wrong happened");
});
db.once("open", () => {
  console.log("Banco carregado");
  app.get("/:title", async (req, res) => {
    let title = req.params.title;
    
    try {
      let doc = await Link.findOne({ title });
      res.redirect(doc.url);
    } catch (err) {
      res.send(err);
    }
  });
});

link
  .save() // method that saves in the DB.
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
