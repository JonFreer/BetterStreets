const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const multerConfig = require("./config/multer");
const multer  = require('multer');
const sharp = require('sharp');
const { Pool, Client } = require('pg');
console.log(process.env.DATABASE_URL)
const client = new Client(
  process.env.DATABASE_URL
)
client.connect()

client.query('SELECT * FROM pg_catalog.pg_tables;', (err, res) => {
  console.log(err, res)
  client.end()
})

const app = express();
const port = 80;



var corsOptions = {
  origin: '*',
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors());
app.options('*', cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const upload = multerConfig.saveToUploads;
app.get("/" ,function(req,res){
  return res.json("API Alive!!");
})
app.post('/submit', function (req, res) {
  console.log("Submit")
    upload(req, res, function (err) {

      if (err instanceof multer.MulterError) {
          console.log("errr",err)
        // A Multer error occurred when uploading.
      } else if (err) {
        console.log("e2",err)
        // An unknown error occurred when uploading.
      }

      console.log(req.file)
      
      sharp(req.file.buffer).resize( {
        width:800,
        kernel: sharp.kernel.cubic,
        fit: 'contain',
        position: 'right top',
        background: { r: 255, g: 255, b: 255, alpha: 0.5 },
        withoutEnlargement: true
      }).toFile('output.webp', (err, info) => { console.log(err,info) });

      sharp(req.file.buffer).resize( {
        width:300,
        height:300,
        kernel: sharp.kernel.cubic,
      }).toFile('thumb.webp', (err, info) => { console.log(err,info) });
      
      console.log(req.body.time)
      console.log(req.body)
      console.log(JSON.parse(req.body.tags))

      const text = 'INSERT INTO uploads(lat, lonx) VALUES($1, $2) RETURNING *'

      return res.json("Success");
      // Everything went fine and save document in DB here.
    })
    // console.log(req.body)
    console.log(req.file)
    console.log(req.body)
   
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