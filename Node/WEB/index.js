const express = require('express');
const axios = require('axios');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000
// const API1_BASE_URL = 'https://assign2api1.azurewebsites.net'; 

const mockImages = [
  {
    url: 'https://via.placeholder.com/150',
    description: 'Image 1 Description'
  },
  {
    url: 'https://via.placeholder.com/150',
    description: 'Image 2 Description'
  },
  {
    url: 'https://via.placeholder.com/150',
    description: 'Image 3 Description'
  },
  {
    url: 'https://via.placeholder.com/150',
    description: 'Image 4 Description'
  },
  {
    url: 'https://via.placeholder.com/150',
    description: 'Image 5 Description'
  },
];

// app.use(refreshToken);
app.use('/', express.static('frontend/build'));

// app.get('/api', (req, res) => {
//   res.send('Hello, world!');
// });

app.get('/api', async (req, res) => {
  res.send(`Secret Value: ${process.env.KVsecret1}`);
});

app.post('/upload', upload.array('filename', 10), (req, res) => {
  console.log(req.files);  // See the files received
  console.log(req.body);
  
  const accessToken = req.headers['x-ms-token-aad-access-token'];
  const files = req.files;
  
  const uploadPromises = files.map(file => {
    const formData = new FormData();
    console.log(file);
    formData.append('filename', fs.createReadStream(file.path));

    const headers = {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${accessToken}`
    };

    return axios.post(`${process.env.API1_BASE_URL}/UploadFile/${file.originalname}`, formData, { headers });
  });

  Promise.all(uploadPromises)
    .then(apiResponses => {
      res.json(apiResponses.map(apiResponse => apiResponse.data));
    })
    .catch(error => {
      console.error('Error uploading to API1:', error);
      if (!res.headersSent) {
        res.status(500).send('Error uploading images');
      }
    });
});


// Endpoint to fetch images
app.get('/images', (req, res) => {
  // Make a GET request to API1 to fetch images
  // res.json(mockImages);
  const accessToken = req.headers['x-ms-token-aad-access-token'];
  const headers = {
    'Authorization': `Bearer ${accessToken}`, // Add the Authorization header with the token
  };
  console.log(`!!!!!: ${process.env.API1_BASE_URL}/getImages`);

  axios.get(`${process.env.API1_BASE_URL}/getImages`, { headers })
    .then(apiResponse => {
      // console.log(apiResponse);
      res.json(apiResponse.data);
    })
    // .then(apiResponse => res.json(mockImages))
    .catch(error => {
      console.error('Error fetching images from API1:', error);
      res.status(500).send('Error fetching images');
    });
});

app.listen(port, () => {
  console.log('Server listening on port '+ port);
});

