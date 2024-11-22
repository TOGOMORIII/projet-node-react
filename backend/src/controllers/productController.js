const Product = require('../models/Product');

// Créer un produit
exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = new Product({ name, price, description });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

    // Diffuser la mise à jour
    const broadcastUpdate = req.app.get('broadcastUpdate');
    broadcastUpdate({ type: 'ADD_PRODUCT', payload: savedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(deletedProduct);

    // Diffuser la suppression
    const broadcastUpdate = req.app.get('broadcastUpdate');
    broadcastUpdate({ type: 'DELETE_PRODUCT', payload: deletedProduct._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(updatedProduct);

    // Diffuser la mise à jour
    const broadcastUpdate = req.app.get('broadcastUpdate');
    broadcastUpdate({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les produits
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


