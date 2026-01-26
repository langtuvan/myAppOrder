// MongoDB initialization script
db = db.getSiblingDB('booking');

// Create collections
db.createCollection('categories');
db.createCollection('products');

// Insert sample data
// db.categories.insertMany([
//   {
//     name: 'Electronics',
//     description: 'Electronic devices and gadgets',
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   },
//   {
//     name: 'Books',
//     description: 'Books and literature',
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }
// ]);

print('Database initialized with sample data');