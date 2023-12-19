const express = require('express');
const multer = require('multer');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.get("/api", (req,res) => {
  res.json({"users":["user1","user2","user3"]})
})
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.json({ message: 'File uploaded successfully' });
 });
app.listen(5000,( () => {console.log("server started on port 5000")}))