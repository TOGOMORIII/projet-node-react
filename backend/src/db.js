const { MongoClient } = require('mongodb');

// URL de connexion (local ou Atlas)
const uri = "mongodb://127.0.0.1:27017/productsDB"; // Local
// const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/productsDB"; // Atlas

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("productsDB"); // Base de données
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };
