import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed, only POST requests are accepted" });
  }

  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required fields" });
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    return res.status(500).json({ message: "Database configuration error: MONGODB_URI is not set" });
  }

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    const result = await collection.insertOne({ 
      name, 
      email, 
      timestamp: new Date() 
    });
    
    console.log(`User added with ID: ${result.insertedId}`);
    res.status(200).json({ message: "User added successfully!", userId: result.insertedId });
  } catch (error) {
    console.error('MongoDB Error:', error);
    let errorMessage = "Internal server error";
    
    if (error.name === 'MongoServerSelectionError') {
      errorMessage = "Could not connect to MongoDB. Please check your connection string and network.";
    } else if (error.code === 121) {
      errorMessage = "Document validation failed";
    }
    
    res.status(500).json({ message: errorMessage, error: error.message });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
};
