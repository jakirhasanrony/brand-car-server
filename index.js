const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ez7hhm.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db('productDB').collection('product')


    app.get('/products', async(req, res)=>{
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result);

    })


    app.post('/products', async(req, res)=>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productsCollection.insertOne(newProduct);
        res.send(result);

    })


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('Brand car server is running')
})
app.listen(port, ()=>{
    console.log(`Bran car server is running on port: ${port}`);
})