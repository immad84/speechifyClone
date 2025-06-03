const { Model, Language } = require("../models/Model");

// Add a Language into database
exports.addLanguage = async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.code) {
      res.status(400).json({
        success: false,
        message: `Missing Required fields name and code`,
      });
    }
    const { name } = req.body;
    let language = await Language.findOne({ name });
    if (language) {
      res
        .status(403)
        .json({ success: false, message: "Language Already Added. " });
    } else {
      const langname = req.body["name"];
      const langcode = req.body["code"];
      language = new Language({ name: langname, code: langcode, models: [] });
      await language.save();
      const { id, name, code } = language;
      res.status(201).json({
        success: true,
        message: "Language Added Successfully..",
        data: { id, name, code },
      });
    }
  } catch (error) {
    const { message } = error;
    res.status(500).json({
      success: false,
      message: "Something Went Wrong..",
      error: message,
    });
  }
};

// Add Languages into database
exports.addLanguages = async (req, res) => {
  const { name } = req.body;
  let language = await Language.findOne({ name });
  if (language) {
    res
      .status(403)
      .json({ success: false, message: "Language Already Added. " });
  } else {
    const langname = req.body["name"];
    const langcode = req.body["code"];
    const modelID = req.body["modelID"];
    language = new Language({
      name: langname,
      code: langcode,
      models: [modelID],
    });
    await language.save();
    const languageID = language._id;
    const model = await Model.findById(modelID);
    model.languages.push(languageID);
    const u = await model.save();
    const { id, name, code, models } = language;
    res.status(201).json({
      success: true,
      message: "Language Added Successfully..",
      language,
      model: u,
    });
  }
};

// get all languaes
exports.getAllLanguages = async (req, res) => {
  try {
    const options = { limit: 5 };
    const languages = await Language.find({}, null, options);
    if (languages) {
      let data = [];
      languages.forEach((language) => {
        const { _id, name, code } = language;
        data.push({ id: _id, name, code });
      });
      res
        .status(200)
        .json({ status: true, message: "Languages fetched..", data });
    } else {
      res
        .status(404)
        .json({ status: false, message: "No languages found. ", data: {} });
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

// get a language
exports.getLanguage = async (req, res) => {
  try {
    const { name } = req.params;
    const language = await Language.findOne({ name });
    if (language) {
      const { _id, name, code } = language;
      res.json({ message: "Language fetched.", data: { id: _id, name, code } });
    } else {
      res.json({ message: "Language Not Found ..." });
    }
  } catch (error) {
    res.json({ message: "error", error: error });
  }
};

// delete language
exports.deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const language = await Language.findByIdAndDelete(id);
    if (language) {
      const { name, code } = language;
      res.json({ message: "Language Deleted...", data: { name, code } });
    } else {
      res.json({ message: "language does not exist. " });
    }
  } catch (error) {
    res.json({ message: "Error", error: error });
  }
};

// update language
exports.updateLanguage = async (req, res) => {
  try {
    const update = req.body;
    const options = { returnDocument: "after" };
    const updated_lang = await Language.findByIdAndUpdate(
      update.id,
      update,
      options
    );
    if (updated_lang) {
      const { _id, name, code } = updated_lang;
      res.json({
        message: "language updated..",
        updated_lang: { id: _id, name, code },
      });
    } else {
      res.json({ message: "Language Not Found..", data: update });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "something went wrong while updating the language..",
      error: error,
    });
  }
};

// patch language
exports.patchLanguage = async (req, res) => {
  try {
    const update = req.body;
    const options = { returnDocument: "after" };
    const updated_lang = await Language.findByIdAndUpdate(
      update.id,
      update,
      options
    );
    if (updated_lang) {
      const { _id, name, code } = updated_lang;
      res.json({
        message: "language updated.",
        updated_lang: { id: _id, name, code },
      });
    } else {
      res.json({ message: "Language Not Found..", data: update });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "something went wrong while updating the language..",
      error: error,
    });
  }
};
