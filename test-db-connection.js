const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    // Set connection timeout to 15 seconds
    const options = {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000,
    };
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB connection successful!');
    
    // Test a simple query
    console.log('🔍 Testing database query...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test Employee model query
    const Employee = require('./models/Employee');
    console.log('👥 Testing Employee.findOne()...');
    const employeeCount = await Employee.countDocuments();
    console.log('📈 Total employees in database:', employeeCount);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

testConnection();