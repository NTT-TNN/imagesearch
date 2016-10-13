const express = require('express');
const util = require('util');
const mongo = require('mongodb');
require('dotenv').config({
  silent: true
});

var url_mongo="mongodb://lebaochi:lebaochi1809@ds057386.mlab.com:57386/imagesearch"
const bingSearch = require('bing.search');

var port=process.env.PORT||3500;

var app=express();
var bing=new bingSearch("7NIsp9AybAlaVSaWIKUlyUKZ0JlwOpkoelitr/gSeNI")

mongo.MongoClient.connect(url_mongo,function(err,db){
  if(err) throw err;
  console.log("Successfully connected to MongoDB on port 27017.");
  db.createCollection("histories",{
    capped:true,
    size:5242880,
    max:10000
  })

  app.get('/api/imagesearch/:query',function(req,res){
    var query=req.params.query;
    var size=req.query.offset||10;
    var history={
      "term": query,
      "when": new Date().toLocaleString()
    }
    db.collection("histories").save(history,function(err){
      if(err) throw err;
      console.log("Da luu");
    })

    bing.images(query,{top:size},function(err,results){
      if(err) throw err;
      var r={};
      for(var i=0;i<size;++i){
        r[i]={
          "url": results[i].url,
         "snippet":results[i].title,
         "thumbnail": results[i].thumbnail.url,
         "context": results[i].sourceUrl
        }
      }
      res.send(r);
    })
  })

  app.get('/lastest',function(req,res){
    db.collection("histories").find({}).toArray (function(err,data){
      if(err) throw err;
      res.send(data);
    })
  })
})



app.listen(port,function(){
  console.log("App running at port 3500");
});
