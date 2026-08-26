import Part from '../models/Part.js';

console.log("--- PART CONTROLLER LOADED ---");

const sampleParts = [
  {
    name: "NVIDIA GeForce RTX 4080 Super 16GB",
    brand: "NVIDIA",
    category: "Computer",
    description: "Ultra-fast graphics card for high-end gaming and 4K rendering.",
    price: 345000,
    countInStock: 10,
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80"
  },
  {
    name: "Intel Core i9-14900K Desktop Processor",
    brand: "Intel",
    category: "Computer",
    description: "24 cores and 32 threads for extreme desktop performance.",
    price: 185000,
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80"
  },
  {
    name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD",
    brand: "Samsung",
    category: "Computer",
    description: "Read speeds up to 7450 MB/s for blazing fast load times.",
    price: 48000,
    countInStock: 25,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80"
  },
  {
    name: "Corsair Vengeance RGB 32GB DDR5 RAM",
    brand: "Corsair",
    category: "Computer",
    description: "6000MHz CL36 high-speed desktop memory with dynamic RGB.",
    price: 38000,
    countInStock: 30,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80"
  },
  {
    name: "iPhone 15 Pro Max Dynamic OLED Screen Assembly",
    brand: "Apple",
    category: "Mobile",
    description: "Original Super Retina XDR OLED display assembly.",
    price: 65000,
    countInStock: 8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"
  },
  {
    name: "Samsung Galaxy S24 Ultra Original Battery 5000mAh",
    brand: "Samsung",
    category: "Mobile",
    description: "Authentic replacement battery with 100% health grade.",
    price: 14500,
    countInStock: 20,
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80"
  }
];

// @desc    Get all parts
export const getParts = async (req, res) => {
  try {
    const { name, category } = req.query;
    let query = {};
    if (name) query.name = { $regex: new RegExp(name, 'i') };
    if (category) query.category = { $regex: new RegExp(category, 'i') };

    let parts = await Part.find(query);

    // Auto seed initial parts if DB is empty
    if (parts.length === 0 && !name && !category) {
      const count = await Part.countDocuments();
      if (count === 0) {
        console.log("Seeding sample parts into empty MongoDB database...");
        parts = await Part.insertMany(sampleParts);
      }
    }

    res.json(parts);
  } catch (error) {
    console.error("--- ERROR in getParts: ---", error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc Seed sample parts
export const seedParts = async (req, res) => {
  try {
    await Part.deleteMany({});
    const createdParts = await Part.insertMany(sampleParts);
    res.json({ message: "Seeded successfully", count: createdParts.length, parts: createdParts });
  } catch (error) {
    res.status(500).json({ message: "Seed failed: " + error.message });
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

// @desc    Create new review for a part or store
// @route   POST /api/parts/:id/reviews
export const createPartReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    let partId = req.params.id;

    let part;
    if (!partId || partId === 'store' || partId === 'general') {
      part = await Part.findOne();
      if (!part) {
        part = await Part.create({
          name: 'PartDoc Store Feedback',
          image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80',
          brand: 'PartDoc',
          category: 'Service',
          description: 'General store feedback & customer reviews',
          price: 0,
          countInStock: 99
        });
      }
    } else {
      part = await Part.findById(partId);
    }

    if (part) {
      const review = {
        name: name || 'Anonymous Customer',
        rating: Number(rating) || 5,
        comment: comment || '',
      };

      part.reviews.push(review);
      part.numReviews = part.reviews.length;
      part.rating = part.reviews.reduce((acc, item) => item.rating + acc, 0) / part.reviews.length;

      await part.save();
      res.status(201).json({ message: 'Review added successfully', reviews: part.reviews, rating: part.rating, numReviews: part.numReviews });
    } else {
      res.status(404).json({ message: 'Part not found' });
    }
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get all reviews across all parts (Admin)
// @route   GET /api/parts/reviews/all
export const getAllReviews = async (req, res) => {
  try {
    const parts = await Part.find({ 'reviews.0': { $exists: true } });
    let allReviews = [];

    parts.forEach(part => {
      part.reviews.forEach(review => {
        allReviews.push({
          _id: review._id,
          partId: part._id,
          partName: part.name,
          partImage: part.image,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        });
      });
    });

    // Sort newest first
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Delete a review from a part (Admin)
// @route   DELETE /api/parts/:partId/reviews/:reviewId
export const deletePartReview = async (req, res) => {
  try {
    const { partId, reviewId } = req.params;
    const part = await Part.findById(partId);

    if (part) {
      part.reviews = part.reviews.filter(r => r._id.toString() !== reviewId);
      part.numReviews = part.reviews.length;
      part.rating = part.reviews.length > 0
        ? part.reviews.reduce((acc, item) => item.rating + acc, 0) / part.reviews.length
        : 5;

      await part.save();
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Part not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};