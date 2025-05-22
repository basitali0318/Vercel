const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const { name, email } = req.body;
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    return res.status(500).json({ message: "Database configuration error" });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    await collection.insertOne({ name, email, timestamp: new Date() });
    res.status(200).json({ message: "User added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
};
