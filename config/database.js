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
    
    // Connection options to prevent timeout issues
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 30000, // 30 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    };

    // Disable mongoose buffering to prevent timeout issues
    mongoose.set('bufferCommands', false);

    mongoose.connect(mongoURI, options)
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