const { Dataset } = require("../models/Model");

// Add Dataset into database
exports.addDataset = async (req, res) => {
  res.status(200).json({ status: true, message: "success" });
};

// Add Datasets into database
exports.addDatasets = async (req, res) => {
  try {
    const { name, code, modelID } = req.body;

    const dataset = await Model.findOne({ name });
    const model = await Model.findById(modelID);

    if (!model) {
      res.status(404).json({ success: false, message: "Model not found." });
    }

    if (dataset) {
      const datasetID = dataset._id;
      const isModelFoundInDataset = dataset.models.some((model) => {
        model.toString() === modelID;
      });
      if (!isModelFoundInDataset) {
        dataset.models.push(modelID);
        await dataset.save();
      }

      const isDatasetFoundInModel = model.datasets.some((datasetInModel) => {
        datasetInModel.toString() === datasetID.toString();
      });
      if (!isDatasetFoundInModel) {
        model.datasets.push(datasetID);
        await model.save();
      }

      res.status(403).json({
        success: false,
        message: "dataset already existed and model is linked with model. ",
      });
    } else {
      const newDataset = new Model({
        name,
        code,
        models: [modelID],
      });
      await newDataset.save();
      model.datasets.push(newDataset._id);
      await model.save();
      res.status(201).json({
        success: true,
        message: "Dataset Added Successfully.",
        language: newLanguage,
        model,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};
