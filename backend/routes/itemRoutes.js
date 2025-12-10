const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemController");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// PUBLIC
router.get("/search", itemsController.searchItems);
router.get("/", itemsController.getAllItems);

// OWNER ROUTES
router.post("/", auth, upload.array("images", 10), itemsController.createItem);
router.get("/owner/:ownerId", auth, itemsController.getItemsByOwner);
router.put("/:id", auth, upload.array("images", 10), itemsController.updateItem);
router.delete("/:id", auth, itemsController.deleteItem);

module.exports = router;
