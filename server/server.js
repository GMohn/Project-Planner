const express = require('express');
const session = require('express-session');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const app = express();
var csv = require("csvtojson");

app.use(session({
 secret: 'my secret key',
 resave: false,
 saveUninitialized: true,
}));

app.post('/api/upload', upload.single('file'), (req, res) => {
 console.log(req.file);
 req.session.uploadedFilename = req.file.filename;
 
 csv()
  .fromFile('uploads/'+req.session.uploadedFilename)
  .then(function(jsonArrayObj){ 
     req.session.jsonData = jsonArrayObj;
     res.json({ message: 'File uploaded and converted to JSON successfully' });

     fs.unlink('uploads/' + req.session.uploadedFilename, (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });
  })
  .catch(error => {
     console.error('Failed to convert CSV to JSON:', error);
     res.status(500).json({ message: 'Failed to convert CSV to JSON' });
  });
});

app.get("/api", (req, res) => {
 if (req.session.jsonData) {
   console.log(req.session.jsonData);
   res.json(req.session.jsonData);
 } else {
   res.status(404).json({ message: 'No JSON data available' });
 }
});

app.listen(5000, () => console.log('Server started on port 5000'));
