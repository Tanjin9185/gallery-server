const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcopb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    console.log(err);
    const memeCollection = client.db("meme").collection("gallery");


    // Add data to database 

    app.post('/addmeme', (req, res) => {
        const image = req.body;
        // const content = req.body.content;
        // const imageurl = req.body.content;
        // const newImage = file.data;
        // const convertImage = newImage.toString("base64");
        // console.log(file)
        // const image = {
        //     contentType: file.mimetype,
        //     name: file.name,
        //     size: file.size,
        //     img: Buffer.from(convertImage, "base64"),
        // };
        memeCollection.insertOne(image)
            .then((result) => {
                res.send(result.insertedCount > 0);
                console.log("Image add to database")
            });


    });


    //load meme 
    app.get("/picturs", (req, res) => {
        memeCollection.find({}).toArray((err, meme) => {
            res.send(meme)
        });
    });


    // Delete meme

    app.delete('/picturs/:id', (req, res) => {
        const id = ObjectID(req.params.id);

        memeCollection.findOneAndDelete({ _id: id })
            .then(result => {
                res.json({ success: !!result.value })
            })
            .then(error => {
                console.log(error);
            })
    });

});




app.get('/', (req, res) => {
    res.send('Hello')
})
app.listen(process.env.PORT || port)