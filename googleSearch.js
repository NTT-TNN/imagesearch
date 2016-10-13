const express = require('express');
const search = require('google-search');

var app=express();
var googleSearch=new search({
  key:'123',// doi hoi API key cua google
  cx:'2'
})

googleSearch.build({
  q:"lolcats funny",
  start:5,
  fileType:"img",
//  gl:"tr",
  num:10,
},function(err,res){
  if(err) return console.log("loi ");
  console.log(res);
});

app.listen(3500);
