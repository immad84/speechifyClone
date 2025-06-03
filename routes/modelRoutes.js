const express = require("express");

const { checkPermission } = require("../middleware/permissions");
const { authMiddleware } = require("../middleware/auth");

const {
  addModel,
  addModels,
  getAllModels,
  getModel,
  deleteModel,
  updateModel,
  patchModel,
} = require("../controllers/modelController");

const router = express.Router();

/**
 * @swagger
 * /model/add-model:
 *   post:
 *     summary: Add a TTS Model (Admin only)
 *     tags: [Model]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "tts_models or vocoder_models"
 *               name:
 *                 type: string
 *                 example: "tacotron2"
 *     responses:
 *       200:
 *         description: Model added successfully
 */
router.post(
  "/add-model",
  authMiddleware,
  checkPermission("add_tts_model"),
  addModel
);

/**
 * @swagger
 * /model/add-models:
 *   post:
 *     summary: Add Models (Admin only)
 *     tags: [Model]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: Model added successfully
 */
router.post(
  "/add-models",
  authMiddleware,
  checkPermission("add_tts_model"),
  addModels
);

/**
 * @swagger
 * /model/view-models:
 *   get:
 *     summary: Get All Models (Admin only)
 *     tags: [Model]
 *     security:
 *       - BearerAuth: [ ]
 *     responses:
 *       200:
 *         description: Models fetched successfully
 */
router.get(
  "/view-models",
  authMiddleware,
  checkPermission("add_tts_model"),
  getAllModels
);

/**
 * @swagger
 * /model/view-model/{name}:
 *   get:
 *     summary: Get A Model (Admin only)
 *     tags: [Model]
 *     security:
 *       - BearerAuth: [ ]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: name of the model to fetch
 *     responses:
 *       200:
 *         description: Model fetched successfully
 */
router.get(
  "/view-model/:name",
  authMiddleware,
  checkPermission("add_tts_model"),
  getModel
);

/**
 * @swagger
 * /model/delete-model/{name}:
 *   delete:
 *     summary: Delete any model (Admin only)
 *     tags: [Model]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: name of the model to delete
 *     responses:
 *       200:
 *         description: Model deleted successfully
 *
 */
router.delete(
  "/delete-model/:name",
  authMiddleware,
  checkPermission("add_tts_model"),
  deleteModel
);

/**
 * @swagger
 * /model/update-model:
 *   put:
 *     summary: Update Model (Admin Only)
 *     tags: [Model]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "65a7d12b9e3f5a0012d34abc"
 *               name:
 *                 type: string
 *                 example: "Urdu"
 *               code:
 *                 type: string
 *                 example: "ur"
 *     responses:
 *       200:
 *         description: model updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: model updated successfully
 */
router.put(
  "/update-model",
  authMiddleware,
  checkPermission("add_tts_model"),
  updateModel
);

/**
 * @swagger
 * /model/patch-model:
 *   patch:
 *     summary: patch the model (Admin only)
 *     tags: [Model]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: string
 *                 format: uuid
 *                 example: "65a7d12b9e3f5a0012d34abc"
 *     responses:
 *       200:
 *         description: updated successfully
 */
router.patch(
  "/patch-model",
  authMiddleware,
  checkPermission("add_tts_model"),
  patchModel
);

module.exports = router;
