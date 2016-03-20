var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
app.set('view engine','ejs');
var mongodb;
app.use( express.static( "public" ) );
mongoClient.connect('mongodb://Vishwajeet:cyzehoc4@ds053448.mlab.com:53448/hospital',function(err,db){
  mongodb = db;
});
app.use(function(req,res,next){
  req.db = mongodb;
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.get('/',function(req,res){
  res.render('index');
});

router.post('/findDoc',function(req,res){

  var collection = req.db.collection('docCollection');
  console.log(req.body.speciality);
  collection.find({"speciality": 'Neurosurgeon'}).toArray(function(e,data){
    console.log(data);
    res.render('doc.ejs',{'data': data});
  });

});

router.post('/regDoc',function(req,res){
  if(req.body.pwd==='cyzehoc4' && req.body.user==='admin'){
    var collection = req.db.collection('docCollection');
    collection.insert({"name": req.body.name,"speciality": 'Neurosurgeon'},function(err,data){
      if(err)
        console.log(err);
      else {
          res.render('registerDoc',{'name': req.body.name,'speciality': 'Neurosurgeon'});
      }
    });
  }
});

router.post('/docCheckInOut',function(req,res){

  var collection = req.db.collection('docCollection');
  collection.findOne({'name': req.body.name},function(err,data){
    if(true){
      collection.updateOne({'name': req.body.name},{'present': false},function(err,data){});
      res.render('docCheckIn',{'name': req.body.name,'check': 'out'});
    } else{
      collection.updateOne({'name': req.body.name},{'present': true},function(err,data){});
      res.render('docCheckIn',{'name': req.body.name,'check': 'in'});
    }
  });
});

router.post('/regPatient',function(req,res){

  var collection = req.db.collection("docCollection");
  var doctor;
  collection.find({"speciality": req.body.service}).toArray(function(err,data){
    doctor = data[0];
    var collection1 = req.db.collection('patCollection');
    collection1.insertOne({"name": req.body.name, "service": req.body.service,'age': req.body.age,'phone': req.body.phone},function(err,data){
      if(err)
        console.log(err);
      else{
        res.render('admit',{'name': req.body.name,'age': req.body.age,'doc': 'Drake Ramoray'});
      }
    });
  });
});

router.post('/dischargePatient',function(req,res){
  var collection = req.db.collection('patCollection');
  collection.deleteOne({'name': req.body.name},function(err,data){
    if(err)
      console.log(err);
    else {
      console.log(req.body.name+ ' Dischared');
    }
  });
    res.render('discharge',{'name': req.body.name});
});

router.post('/checkDocPresence',function(req,res){
  var collection = req.db.collection('docCollection');
  collection.findOne({"name": req.body.name,"speciality": req.body.speciality},function(err,data){
    if(data.present===true){
      res.json({"message": true});
    } else{
      res.json({"message": false});
    }
  });
});

app.use('/',router);
app.listen(port);
console.log("Server Running on: "+port);
