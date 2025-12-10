const Item = require("../models/Item");

// ------------------------
// GET ALL ITEMS
// ------------------------
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching items" });
  }
};

// ------------------------
// SEARCH ITEMS
// ------------------------
exports.searchItems = async (req, res) => {
  try {
    const q = req.query.q || "";

    const items = await Item.find({
      title: { $regex: q, $options: "i" },
    })
      .limit(50)
      .populate("category");

    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
};

// ------------------------
// CREATE NEW ITEM (OWNER)
// ------------------------
exports.createItem = async (req, res) => {
  try {
    console.log("[CREATE ITEM] Request body:", req.body);
    console.log("[CREATE ITEM] Files:", req.files?.length || 0);

    // Parse JSON fields from FormData
    const itemData = {};
    
    // Handle all form fields
    for (const key in req.body) {
      const value = req.body[key];
      // Try to parse JSON fields
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          itemData[key] = JSON.parse(value);
        } catch (e) {
          itemData[key] = value;
        }
      } else {
        itemData[key] = value;
      }
    }

    // Map itemName to title
    itemData.title = itemData.itemName || itemData.title;
    itemData.owner = req.user.id;

    // Handle images
    if (req.files && req.files.length > 0) {
      itemData.images = req.files.map(file => {
        // Convert buffer to base64 for storage
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      });
    }

    console.log("[CREATE ITEM] Creating item with data:", { 
      title: itemData.title, 
      owner: itemData.owner,
      imagesCount: itemData.images?.length || 0 
    });

    const item = new Item(itemData);
    await item.save();
    
    console.log("[CREATE ITEM] Item saved successfully:", item._id);

    res.status(201).json({
      success: true,
      _id: item._id,
      message: "Item created successfully",
      item: item
    });
  } catch (err) {
    console.error("[CREATE ITEM] Error:", err);
    res.status(500).json({ 
      success: false,
      msg: "Error creating item",
      message: err.message 
    });
  }
};

// ------------------------
// GET ITEMS BY OWNER
// ------------------------
exports.getItemsByOwner = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.params.ownerId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching owner items" });
  }
};

// ------------------------
// UPDATE ITEM
// ------------------------
exports.updateItem = async (req, res) => {
  try {
    // Parse JSON fields from FormData
    const updateData = {};
    
    // Handle all form fields
    for (const key in req.body) {
      if (key === 'owner') continue; // Don't allow owner change
      
      const value = req.body[key];
      // Try to parse JSON fields
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          updateData[key] = JSON.parse(value);
        } catch (e) {
          updateData[key] = value;
        }
      } else {
        updateData[key] = value;
      }
    }
    
    // Map itemName to title if provided
    if (updateData.itemName) {
      updateData.title = updateData.itemName;
    }

    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => {
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        msg: "Item not found" 
      });
    }

    res.json({
      success: true,
      message: "Item updated successfully",
      item: updated
    });
  } catch (err) {
    console.error("[UPDATE ITEM] Error:", err);
    res.status(500).json({ 
      success: false,
      msg: "Update failed",
      message: err.message 
    });
  }
};

// ------------------------
// DELETE ITEM
// ------------------------
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        msg: "Item not found" 
      });
    }

    res.json({ 
      success: true,
      msg: "Item deleted successfully",
      message: "Item deleted" 
    });
  } catch (err) {
    console.error("[DELETE ITEM] Error:", err);
    res.status(500).json({ 
      success: false,
      msg: "Delete failed",
      message: err.message 
    });
  }
};

// ------------------------
// FEATURED ITEMS
// ------------------------
exports.getFeaturedItems = async (req, res) => {
  try {
    const items = await Item.find({
      featured: true,
      available: true,
    })
      .limit(12)
      .populate("category");

    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
