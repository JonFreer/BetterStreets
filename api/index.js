const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const multerConfig = require("./config/multer");
const multer  = require('multer');
const app = express();
const port = 80;

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const upload = multerConfig.saveToUploads;
app.get("/" ,function(req,res){
  return res.json("API Alive!");
})
app.post('/submit', function (req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          console.log("errr",err)
        // A Multer error occurred when uploading.
      } else if (err) {
        console.log("e2",err)
        // An unknown error occurred when uploading.
      }
      console.log(req.body.time)
      console.log(req.body)
      console.log(JSON.parse(req.body.tags))
      // Everything went fine and save document in DB here.
    })
    // console.log(req.body)

    return res.json("file uploaded successfully");
  })
    // We will be coding here
    // const book = req.body;

    // // Output the book to the console for debugging
    // console.log(book);
    // // books.push(book);

    // res.send('Book is added to the database');\return res.json("file uploaded successfully");
//     return res.json("file uploaded successfully");
// });

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));