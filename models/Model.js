const mongoose = require("mongoose");

// Model Schema
const ttsModelSchema = new mongoose.Schema({
  modelType: { type: String, requied: true },
  modelLanguages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Language",
      required: true,
    },
  ],
  modelDatasets: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Dataset",
      required: true,
    },
  ],
  modelName: { type: String, required: true, unique: true },
  modelDisplayName: { type: String, required: true, unique: true },
});

// Language Schema
const languageSchema = new mongoose.Schema({
  languageName: { type: String, required: true },
  languageCode: { type: String, required: true },
  languageModels: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Model",
    },
  ],
});

// Dataset Schema
const datasetSchema = new mongoose.Schema({
  datasetName: { type: String, required: true },
  datasetCode: { type: String, required: true },
  datasetModels: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Model",
    },
  ],
});

const Model = mongoose.model("Model", ttsModelSchema);
const Language = mongoose.model("Language", languageSchema);
const Dataset = mongoose.model("Dataset", datasetSchema);

module.exports = { Model, Language, Dataset };
