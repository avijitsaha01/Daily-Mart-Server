const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6yczn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connet", err)
    const productCollection = client.db("dailymart").collection("products");
    
    // console.log("database connected")

    app.get('/products', (req, res) => {
        productCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.delete('/deleteProduct:id', (req, res)=>{
        const id = ObjectID(req.params.id)
        console.log(id)
        productCollection.findOneAndDelete({_id: id})
        .then(result => {
            res.send(result.deletedCount > 0);
          })
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})