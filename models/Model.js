const mongoose = require("mongoose");


const ttsModelSchema = new mongoose.Schema({
  type: {type: String, requied: true},
  languages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Language",
      required: true,
    },
  ],
  name: { type: String, required: true, unique: true },
  datasets: [{type: String, required: true}],
});


const languageSchema = new mongoose.Schema({
  name: {type: String, required: true},
  code: {type: String, required: true},
  models: [{
    type: mongoose.Types.ObjectId,
    ref: "Model",
  }]
})

const Model = mongoose.model("Model", ttsModelSchema);
const Language = mongoose.model("Language", languageSchema);

module.exports = { Model, Language };