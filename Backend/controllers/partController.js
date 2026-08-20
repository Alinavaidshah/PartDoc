import Part from '../models/Part.js';

console.log("--- PART CONTROLLER LOADED ---");

// @desc    Get all parts
export const getParts = async (req, res) => {
  try {
    const { name, category } = req.query;
    let query = {};
    if (name) query.name = { $regex: new RegExp(name, 'i') };
    if (category) query.category = { $regex: new RegExp(category, 'i') };

    const parts = await Part.find(query);
    res.json(parts);
  } catch (error) {
    console.error("--- ERROR in getParts: ---", error); // DEBUGGING LINE
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Create a part (Admin)
export const createPart = async (req, res) => {
  try {
    const { name, brand, category, description, price, countInStock } = req.body;
    
    // Cloudinary se aane wala secure URL path
    const imagePath = req.file ? req.file.path : null;

    const part = new Part({
      name,
      image: imagePath,
      brand,
      category,
      description,
      price,
      countInStock,
    });

    const createdPart = await part.save();
    res.status(201).json(createdPart);
  } catch (error) {
    console.error("--- ERROR in createPart: ---", error); // DEBUGGING LINE
    res.status(400).json({ message: 'Error: ' + error.message });
  }
};

// @desc    Get single part by ID
export const getPartById = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (part) res.json(part);
    else res.status(404).json({ message: 'Part not found' });
  } catch (error) {
    console.error("--- ERROR in getPartById: ---", error); // DEBUGGING LINE
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get low stock parts
export const getLowStockParts = async (req, res) => {
  console.log("--- INSIDE getLowStockParts ---"); // Ye zaroor aana chahiye
  try {
    console.log("--- TRYING TO FETCH PARTS ---");
    const lowStockParts = await Part.find({ countInStock: { $lt: 5 } });
    console.log("--- FOUND PARTS: ---", lowStockParts); // Ye check karo
    res.json(lowStockParts);
  } catch (error) {
    console.error("--- CRITICAL ERROR in getLowStockParts: ---", error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update a part
export const updatePart = async (req, res) => {
  try {
    const { name, brand, category, description, price, countInStock } = req.body;
    const part = await Part.findById(req.params.id);

    if (part) {
      part.name = name || part.name;
      part.brand = brand || part.brand;
      part.category = category || part.category;
      part.description = description || part.description;
      part.price = price !== undefined ? price : part.price;
      part.countInStock = countInStock !== undefined ? countInStock : part.countInStock;
      
      // Agar nayi image upload ki gayi hai toh Cloudinary URL update karo
      if (req.file) {
        part.image = req.file.path;
      }

      const updatedPart = await part.save();
      res.json(updatedPart);
    } else {
      res.status(404).json({ message: 'Part not found' });
    }
  } catch (error) {
    console.error("--- ERROR in updatePart: ---", error); // DEBUGGING LINE
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Delete a part
export const deletePart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (part) {
      await Part.deleteOne({ _id: req.params.id });
      res.json({ message: 'Part removed successfully' });
    } else {
      res.status(404).json({ message: 'Part not found' });
    }
  } catch (error) {
    console.error("--- ERROR in deletePart: ---", error); // DEBUGGING LINE
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};