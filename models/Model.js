const mongoose = require("mongoose");


const ttsModelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  languages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Language",
      required: true,
    },
  ],
});

const languageSchema = new mongoose.Schema({
  name: {type: String, required: true},
  models: [{
    type: mongoose.Types.ObjectId,
    ref: "Model",
    required: true
  }]
})

const Model = mongoose.model("Model", ttsModelSchema);
const Language = mongoose.model("Language", languageSchema);

module.exports = { Model, Language };