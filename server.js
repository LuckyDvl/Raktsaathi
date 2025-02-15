// server.js
const express = require('express');
const multer  = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configure multer storage (files will be saved in the "uploads" folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware to parse URL-encoded data (for text fields) 
app.use(express.urlencoded({ extended: true }));
// (No need for express.json() here because we’re using FormData)

// Serve static files from the "public" folder
app.use(express.static('public'));

// In-memory storage for blood requests
let requests = [];

// Endpoint to add a new blood request with file uploads
app.post('/api/requests', upload.fields([
  { name: 'reportsImages', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  // Text fields from the form are in req.body, files in req.files
  const {
    name,
    fatherName,
    age,
    gender,
    bloodGroup,
    mobile,
    email,
    street,
    city,
    state,
    pinCode,
    altMobile,
    emergency
  } = req.body;
  
  // Simple required fields check
  if (!name || !fatherName || !age || !gender || !bloodGroup || !mobile || !street || !city || !state || !pinCode || !emergency) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Process uploaded files
  let reportsImages = [];
  if (req.files['reportsImages']) {
    reportsImages = req.files['reportsImages'].map(file => file.path);
  }
  
  let video = "";
  if (req.files['video'] && req.files['video'][0]) {
    video = req.files['video'][0].path;
  }
  
  const newRequest = {
    id: requests.length + 1,
    name,
    fatherName,
    age,
    gender,
    bloodGroup,
    mobile,
    email: email || "",
    address: {
      street,
      city,
      state,
      pinCode,
      altMobile: altMobile || ""
    },
    emergency,
    reportsImages,
    video
  };
  
  requests.push(newRequest);
  res.status(201).json(newRequest);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
