const { Model, Language } = require("../models/Model");

// add model into database
exports.addModel = async (req, res) => {
  try {
    if (!req.body || !req.body.type || !req.body.name) {
      res.status(400).json({
        success: false,
        message: `Missing Required fields`,
      });
    }
    const { name } = req.body;
    let model = await Model.findOne({ name });
    if (model) {
      res
        .status(403)
        .json({ success: false, message: "Model Already Added. " });
    } else {
      const model_type = req.body["type"];
      const model_name = req.body["name"];
      model = new Model({
        type: model_type,
        languages: [],
        datasets: [],
        name: model_name,
      });
      await model.save();
      const { id, name } = model;
      res.status(201).json({
        success: true,
        message: "Model Added Successfully..",
        data: { id, name },
      });
    }
  } catch (error) {
    const { message } = error;
    res.status(500).json({
      success: false,
      message: "Internal Server Error...",
      error: message,
    });
  }
};

// Add Models into database
exports.addModels = async (req, res) => {
  res.status(200).json({ success: true, message: "Inside add models" });
};

// get all Models
exports.getAllModels = async (req, res) => {
  try {
    const options = { limit: 5 };
    const models = await Model.find({}, null, options);
    if (models) {
      let data = [];
      models.forEach((model) => {
        const { _id, name, code, languages } = model;
        data.push({ id: _id, name, code, languages });
      });
      res.status(200).json({ status: true, message: "Models fetched..", data });
    } else {
      res
        .status(404)
        .json({ status: false, message: "No models found. ", data: {} });
    }
  } catch (error) {
    const { message } = error;
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: message,
    });
  }
};

// get a Model
exports.getModel = async (req, res) => {
  try {
    const { name } = req.params;
    const model = await Model.findOne({ name });
    if (model) {
      const { _id, type, languages, datasets, name } = model;
      res.json({
        message: "Model fetched.",
        data: { id: _id, type, languages, datasets, name },
      });
    } else {
      res.json({ message: "Model Not Found ..." });
    }
  } catch (error) {
    res.json({ message: "Internal Sever Error", error: error.message });
  }
};

// delete Model
exports.deleteModel = async (req, res) => {
  res.status(200).json({ success: true, message: "inside delete models" });
};

// update Model
exports.updateModel = async (req, res) => {
  res.status(200).json({ success: true, message: "inside update models" });
};

// patch Model
exports.patchModel = async (req, res) => {
  res.status(200).json({ success: true, message: "inside patch model" });
};
