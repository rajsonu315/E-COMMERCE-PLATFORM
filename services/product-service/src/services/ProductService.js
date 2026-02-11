const ProductRepository = require('../repositories/ProductRepository');
const AppError = require('../utils/AppError');

class ProductService {
  async getAllProducts() {
    return await ProductRepository.findAll();
  }

  async getProduct(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async createProduct(data) {
    // Generate slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-');
    }
    const id = await ProductRepository.create(data);
    return { id, ...data };
  }

  async updateProduct(id, data) {
    const product = await this.getProduct(id);
    
    // Update slug if name changes
    if (data.name && data.name !== product.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-');
    } else {
      data.slug = product.slug;
    }

    // Merge existing data with new data
    const updatedData = { ...product, ...data };
    // Map back camelCase to repository expectations if needed, but repository expects object matching its destructuring
    // The repository expects: name, slug, description, price, stockQuantity, categoryId, imageUrl
    // Note: getProduct returns DB columns (snake_case) usually if not transformed.
    // Let's check repository findAll/findById. It does `SELECT *`. So keys are snake_case.
    // We need to handle this mapping.
    
    // Helper to map DB to domain
    const mapToDomain = (p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stockQuantity: p.stock_quantity,
      categoryId: p.category_id,
      imageUrl: p.image_url,
      ...p // keep others
    });

    const currentDomain = mapToDomain(product);
    const merged = { ...currentDomain, ...data };

    await ProductRepository.update(id, merged);
    return { id, ...merged };
  }

  async deleteProduct(id) {
    const product = await this.getProduct(id); // Ensure exists
    await ProductRepository.delete(id);
    return true;
  }
}

module.exports = new ProductService();
