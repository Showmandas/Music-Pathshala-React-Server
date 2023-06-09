const express=require('express')
const app=express()
const cors=require('cors')
require("dotenv").config();
const port=process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mz723df.mongodb.net/?retryWrites=true&w=majority`;

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


    const classCollection=client.db('music_school').collection('musics');
    const instructorCollection=client.db('music_school').collection('instructors');
    const seatCollection=client.db('music_school').collection('seats');
    const usersCollection=client.db('music_school').collection('users');
    

    // users related apis 
    app.get('/users',async(req,res)=>{
      const result=await usersCollection.find().toArray();
      res.send(result)
  })
    app.post('/users',async(req,res)=>{
      const user=req.body;
      const result=await usersCollection.insertOne(user)
      res.send(result);
    })

    //load top classes
    app.get('/classes',async(req,res)=>{
        const result=await classCollection.find().toArray();
        res.send(result)
    })

    //load top instructors data

    app.get('/instructors',async(req,res)=>{
        const result=await instructorCollection.find().toArray();
        res.send(result)
    })

    //enroll seat

    // create seat api 
    app.get('/seats',async(req,res)=>{
      const email=req.query.email;
      console.log(email)
      if(!email){
        res.send([])
      }
      const query={email:email}
      const result=await seatCollection.find(query).toArray();
      res.send(result)
  })

  //create seats
    app.post('/seats',async(req,res)=>{
      const seatItem=req.body;
      console.log(seatItem);
      const result=await seatCollection.insertOne(seatItem)
      res.send(result);
    })

    // delete my classes seat 
    app.delete('/seats/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id : new ObjectId(id)}
      const result=await seatCollection.deleteOne(query)
res.send(result)
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



app.get('/',(req,res)=>{
    res.send('Music school is running');
})

app.listen(port,()=>{
    console.log(`Music School is running on ${port}`)
})