import { MongoClient } from 'mongodb';
import { PRODUCTS } from '../src/models/productData';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedProducts() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db('nestania');
    const productsCollection = db.collection('products');
    
    // Check if products already exist
    const existingCount = await productsCollection.countDocuments();
    console.log(`📊 Existing products in database: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('⚠️  Products already exist in database.');
      console.log('🗑️  Clearing existing products...');
      await productsCollection.deleteMany({});
      console.log('✅ Existing products cleared');
    }
    
    console.log(`📦 Seeding ${PRODUCTS.length} products to database...`);
    
    // Add timestamps to products
    const productsWithTimestamps = PRODUCTS.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert all products
    const result = await productsCollection.insertMany(productsWithTimestamps);
    console.log(`✅ Successfully inserted ${result.insertedCount} products`);
    
    // Create indexes for better performance
    console.log('🔍 Creating indexes...');
    await productsCollection.createIndex({ id: 1 }, { unique: true });
    await productsCollection.createIndex({ category: 1 });
    await productsCollection.createIndex({ name: 1 });
    await productsCollection.createIndex({ price: 1 });
    await productsCollection.createIndex({ rating: 1 });
    await productsCollection.createIndex({ inStock: 1 });
    await productsCollection.createIndex({ tags: 1 });
    
    console.log('✅ Indexes created successfully');
    console.log('🎉 Product seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedProducts();