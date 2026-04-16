const Product = require("../models/Product");

// ============================================
// CREATE — POST /api/products
// ============================================
// Teaches: Creating a document with more fields and enum validation
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================================
// GET ALL — GET /api/products
// Teaches: Query params, filtering, pagination
// Example: /api/products?category=food&minPrice=10&maxPrice=100&page=1&limit=5
// ============================================
const getProducts = async (req, res) => {
  try {
    // --- STEP A: Extract query parameters from the URL ---
    // If not provided, use defaults
    const { category, minPrice, maxPrice, page = 1, limit = 5 } = req.query;

    // --- STEP B: Build a filter object dynamically ---
    // We only add a filter if the user actually sent that query param
    const filter = {};

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (minPrice || maxPrice) {
      filter.price = {}; // price is an object with operators
      if (minPrice) filter.price.$gte = Number(minPrice); // greater than or equal
      if (maxPrice) filter.price.$lte = Number(maxPrice); // less than or equal
    }
    // --- STEP C: Pagination math ---
    const pageNum = parseInt(page); // e.g. page 2
    const limitNum = parseInt(limit); // e.g. 5 results per page
    const skip = (pageNum - 1) * limitNum; // page 2 = skip first 5 results

    // --- STEP D: Run the query ---
    const products = await Product.find(filter)
      .skip(skip) // skip results from previous pages
      .limit(limitNum); // only return this many results

    // --- STEP E: Count total matching documents (for frontend to know total pages) ---
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      total, // total matching products
      page: pageNum,
      totalPages: Math.ceil(total / limitNum), // e.g. 13 products / 5 = 3 pages
      count: products.length, // products on this page
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// GET ONE — GET /api/products/:id
// Teaches: Fetching a single document + handling not found
// ============================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    // Catches invalid MongoDB ID format e.g. /api/products/abc123bad
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// PUT — PUT /api/products/:id
// Teaches: Full document replacement with validation
// ============================================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================================
// PATCH — PATCH /api/products/:id
// Teaches: Partial update with $set
// ============================================
const patchProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================================
// DELETE — DELETE /api/products/:id
// ============================================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  patchProduct,
  deleteProduct,
};
