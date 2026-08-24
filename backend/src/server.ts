import dotenv from 'dotenv';
dotenv.config();

import { databaseService } from './services/DatabaseService';
import { createApp } from './app';

async function seedDatabase() {
  try {
    const adminCount = await databaseService.getAdminUsersCount();
    if (adminCount === 0) {
      await databaseService.createAdminUser('admin@nestania.com', 'admin123', 'Admin User');
      console.log('✅ Seeded default admin user (admin@nestania.com / admin123)');
    }
  } catch (error) {
    console.error('Admin seed error:', error);
  }
}

async function startServer() {
  const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

  // Wait for MongoDB to finish initializing
  await databaseService.waitForInit();

  const dbConnected = await databaseService.testConnection();
  if (dbConnected) {
    console.log('✅ MongoDB Atlas connected successfully');
    await seedDatabase();
  } else {
    console.log('⚠️  MongoDB unavailable - running with in-memory storage');
  }

  const { app, allowedOrigins } = createApp(dbConnected);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Nestania API server running on http://localhost:${PORT}`);
    console.log(`   Allowed origins (CORS): ${allowedOrigins.join(', ')}`);
  });
}

startServer();
