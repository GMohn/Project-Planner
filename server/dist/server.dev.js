"use strict";

var express = require('express');

var session = require('express-session');

var multer = require('multer');

var upload = multer({
  dest: 'uploads/'
});

var fs = require('fs');

var app = express();

var csv = require("csvtojson");

app.use(session({
  secret: 'my secret key',
  resave: false,
  saveUninitialized: true
}));
app.post('/api/upload', upload.single('file'), function (req, res) {
  console.log(req.file);
  req.session.uploadedFilename = req.file.filename;
  csv().fromFile('uploads/' + req.session.uploadedFilename).then(function (jsonArrayObj) {
    req.session.jsonData = jsonArrayObj;
    res.json({
      message: 'File uploaded and converted to JSON successfully'
    });
    fs.unlink('uploads/' + req.session.uploadedFilename, function (err) {
      if (err) {
        console.error('Failed to delete file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });
  })["catch"](function (error) {
    console.error('Failed to convert CSV to JSON:', error);
    res.status(500).json({
      message: 'Failed to convert CSV to JSON'
    });
  });
});
app.get("/api", function (req, res) {
  if (req.session.jsonData) {
    console.log(req.session.jsonData);
    res.json(req.session.jsonData);
  } else {
    res.status(404).json({
      message: 'No JSON data available'
    });
  }
});
app.listen(5000, function () {
  return console.log('Server started on port 5000');
});