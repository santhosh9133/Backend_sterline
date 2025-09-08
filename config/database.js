const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    const mongoURI = process.env.MONGODB_URI;
    
    // Check if MongoDB URI is defined
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not defined!');
      console.error('Please check your .env file or environment variables in your deployment platform.');
      process.exit(1);
    }
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 MongoDB URI exists:', mongoURI ? 'Yes' : 'No');
    
    mongoose.connect(mongoURI)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('🔍 Full error details:', error);
      console.error('💡 Please check:');
      console.error('   - Your MongoDB URI is correct');
      console.error('   - Your network connection');
      console.error('   - MongoDB server is running');
      console.error('   - Database credentials are valid');
      process.exit(1);
    });

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      console.error(' Mongoose connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Handle process termination
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log(' MongoDB connection closed due to app termination');
        process.exit(0);
      });
    });
  }

  getConnection() {
    return mongoose.connection;
  }
}

module.exports = new Database();