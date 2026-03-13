const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to local MongoDB (${error.message}).`);
    console.log('Falling back to in-memory MongoDB (mongodb-memory-server)...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`In-Memory DB Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
