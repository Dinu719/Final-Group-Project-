const{Mongoclient} = require('mongodb');

const client = new MongoClient("mongodb://localhost",{
    useNewUrlParser: true
  });

client.connect((error,dbClient)=>{
if(error){
  console.log("ERROR, error");
}
if(dbClient){
  console.log("connected to Mongodb");
}
})