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
    console.log(model);
    if (model) {
      res
        .status(403)
        .json({ success: false, message: "Model Already Added. " });
    } else {
      const model_type = req.body["type"];
      const model_name = req.body["name"];
      console.log(model_name);
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
  res.status(200).json({ success: true, message: "inside get all models" });
};

// get a Model
exports.getModel = async (req, res) => {
  res.status(200).json({ success: true, message: "inside get a models" });
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
