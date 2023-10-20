const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()

const port = process.env.PORT || 5000
/// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.haioro2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("highStyleDB");
    const userCollection = database.collection('items');

    app.get('/items', async(req, res) => {
        const items = await userCollection.find().toArray();
        res.send(items);
    })
    app.get('/items/:name', async(req, res) => {
        const id = req.params.name;
        const query = {brandName : id }
        const cursor = userCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/item/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const cursor = userCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
      
    app.post('/items', async(req, res) => {
        const item = req.body;
        console.log('new item', item);
        const result = await userCollection.insertOne(item);
        res.send(result);

    })

    app.put('/item/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)};
        const options = {upsert: true}
        const updatedItem = req.body;
        const item = {
            $set: {
                name : updatedItem.name,
                image : updatedItem.image,
                brandName : updatedItem.brandName,
                price : updatedItem.price,
                description : updatedItem.description,
                type : updatedItem.type,
                rating: updatedItem.rating

            }
        }
        const result = await userCollection.updateOne(filter, item, options);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})