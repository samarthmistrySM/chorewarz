const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGO_URI) {
    const err = new Error("MONGO_URI is not set in environment variables");
    console.error(err.message);
    throw err;
  }

  if (!cached.promise) {
    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGO_URI, connectOptions)
      .then((mongooseInstance) => {
        console.log("Connected to MongoDB");
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset the cached promise so subsequent attempts can retry
        cached.promise = null;
        console.error("MongoDB connection error:", err.message || err);
        throw err;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

module.exports = { connectDatabase };