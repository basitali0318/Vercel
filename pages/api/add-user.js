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

  // Log the received request for debugging
  console.log('Request received:', { 
    headers: req.headers,
    method: req.method,
    url: req.url,
    body: req.body
  });

  const { name, email } = req.body || {};
  
  if (!name || !email) {
    console.error('Missing required fields:', { name, email });
    return res.status(400).json({ message: "Name and email are required fields" });
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    return res.status(500).json({ message: "Database configuration error: MONGODB_URI is not set" });
  }

  // For testing - uncomment to bypass MongoDB for testing the API
  // return res.status(200).json({ message: "Test successful - MongoDB connection bypassed", mockData: { name, email }});

  let client;
  try {
    // Logging MongoDB connection attempt
    console.log('Attempting to connect to MongoDB with URI:', uri.substring(0, 20) + '...');
    
    // Use newer MongoDB connection options
    client = new MongoClient(uri, {
      // Modern driver doesn't need these options explicitly, but added for compatibility
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    const result = await collection.insertOne({ 
      name, 
      email, 
      timestamp: new Date() 
    });
    
    console.log(`User added with ID: ${result.insertedId}`);
    return res.status(200).json({ message: "User added successfully!", userId: result.insertedId });
  } catch (error) {
    console.error('MongoDB Error:', error);
    console.error('Error stack:', error.stack);
    let errorMessage = "Internal server error";
    let details = {};
    
    if (error.name === 'MongoServerSelectionError') {
      errorMessage = "Could not connect to MongoDB. Please check your connection string and network.";
      details.type = 'connection_error';
    } else if (error.code === 121) {
      errorMessage = "Document validation failed";
      details.type = 'validation_error';
    } else if (error.name === 'MongoParseError') {
      errorMessage = "Invalid MongoDB connection string";
      details.type = 'connection_string_error';
    }
    
    return res.status(500).json({ 
      message: errorMessage, 
      error: error.message,
      details: details
    });
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('MongoDB connection closed');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }
  }
};
