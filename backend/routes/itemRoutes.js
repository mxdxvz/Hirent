const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemController");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const validationHandler = require("../utils/validators/validationHandler");
const {
  createItemValidator,
  updateItemValidator,
} = require("../utils/validators/itemValidator");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// PUBLIC
router.get("/search", itemsController.searchItems);
router.get("/:id", itemsController.getSingleItem);
router.get("/", itemsController.getAllItems);

// OWNER ROUTES with Validation
router.post("/", auth, upload.array("images", 10), createItemValidator, validationHandler, itemsController.createItem);
router.get("/owner/:ownerId", auth, itemsController.getItemsByOwner);
router.put("/:id", auth, upload.array("images", 10), updateItemValidator, validationHandler, itemsController.updateItem);
router.delete("/:id", auth, itemsController.deleteItem);
router.patch("/:id/status", auth, itemsController.updateItemStatus);

module.exports = router;
