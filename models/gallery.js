const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  date: String,
  heading: String,
  imagesPath: [{ type: String }],
});

var model;
try {
  model = mongoose.model("gallery");
} catch {
  model = mongoose.model("gallery", schema);
}

export default model;
