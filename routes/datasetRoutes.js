const express = require("express");

const { checkPermission } = require("../middleware/permissions");
const { authMiddleware } = require("../middleware/auth");

const { addDataset, addDatasets } = require("../controllers/datasetController");

const router = express.Router();

/**
 * @swagger
 * /dataset/add-dataset:
 *   post:
 *     summary: Add a Dataset (Admin only)
 *     tags: [Dataset]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Common Voice"
 *               code:
 *                 type: string
 *                 example: "cv"
 *     responses:
 *       200:
 *         description: Language added successfully
 */
router.post(
  "/add-dataset",
  authMiddleware,
  checkPermission("add_tts_model"),
  addDataset
);

/**
 * @swagger
 * /dataset/add-datasets:
 *   post:
 *     summary: Add Datasets (Admin only)
 *     tags: [Dataset]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelID:
 *                 type: string
 *                 format: uuid
 *                 example: "65a7d12b9e3f5a0012d34abc"
 *               name:
 *                 type: string
 *                 example: "Common Voice"
 *               code:
 *                 type: string
 *                 example: "cv"
 *     responses:
 *       200:
 *         description: Language added successfully
 */
router.post(
  "/add-datasets",
  authMiddleware,
  checkPermission("add_tts_model"),
  addDatasets
);

module.exports = router;
