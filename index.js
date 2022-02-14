const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const app = express()
const port =process.env.PORT || 5000;
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmyfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database=client.db('bd_travel');
        const servicesCollection=database.collection('services');

        // GET api 
        app.get('/services', async(req,res)=>{
            const cursor=servicesCollection.find({});
            const services=await cursor.toArray();
            res.send(services)
        })

        // GET Single Service
        app.get('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const service=await servicesCollection.findOne(query);
            res.json(service);
        })

        // Post API 
        app.post('/services',async(req,res)=>{
            const service=req.body;
            console.log('hit the post api',service);
            const result=await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // Update API
        app.put('/services/:id',async(req,res)=>{
        const id=(req.params.id);
        const updatedService=req.body;
        const filter={_id:ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
          $set: {
           name: updatedService.name,
           price: updatedService.price,
           img: updatedService.img,
           discrip: updatedService.discrip,
          }
        };
        const result=await servicesCollection.updateOne(filter,updateDoc,options)
         console.log('updating Service',id);
         res.json(result);
       })

        // DELETE Api 
        app.delete('/services/:id', async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Genius Car Start')
})

app.listen(port, () => {
  console.log(`Running Genius Car Server on Port ${port}`)
})