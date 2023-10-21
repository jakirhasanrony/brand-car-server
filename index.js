const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();
        const productsCollection = client.db('productDB').collection('product')
        const cartProductsCollection = client.db('productDB').collection('productCart')


        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(query);
            res.send(result)

        })

        app.get('/user-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {user_id: id};
            const result = await cartProductsCollection.findOne(query);
            res.send(result);
        })


        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);

        })

        //  user related
        

        app.put('/user-products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {user_id: id};
            const cartProduct = req.body;

            const doesExist = await cartProductsCollection.findOne(filter);
            if(doesExist){
                const options = {upsert: true};
                const newCartProduct = {
                    $set:{
                        user_id: cartProduct.user_id,
                        newUniqueCart: cartProduct.newUniqueCart
                    }
                }
                const updateResult = await cartProductsCollection.updateOne(filter, newCartProduct, options);
                res.send(updateResult);
            }else{
                const insertResult = await cartProductsCollection.insertOne(cartProduct);
                res.send(insertResult)
            }

        })



        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;

            const newUpdatedProduct = {
                $set: {
                    name: updatedProduct.name,
                    photo: updatedProduct.photo,
                    brand: updatedProduct.brand,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating

                }
            }
            const result = await productsCollection.updateOne(filter, newUpdatedProduct,
                options);
            res.send(result);


        })



        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Brand car server is running')
})
app.listen(port, () => {
    console.log(`Brand car server is running on port: ${port}`);
})