const express = require('express');
const axios = require('axios');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000
const API1_BASE_URL = 'https://assign2api1.azurewebsites.net'; 

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

const refreshToken = async function (req, _, next) {

  // Set default middleware values
  req.tokenMiddleware = {
    "token": "",
    "decoded": ""
  };

  // Get token from injected headers
  req.tokenMiddleware.token = req.headers['x-ms-token-aad-access-token'];
  
  if (!req.tokenMiddleware.token) {
    return next();
  }

  // Decode token
  req.tokenMiddleware.decoded = jwt_decode(req.tokenMiddleware.token);

  // Check if token is expired
  req.tokenMiddleware.isExpired = isTokenExpired(req.tokenMiddleware.decoded.exp);

  // If token is expired, refresh it
  if (req.tokenMiddleware.isExpired.expired) {

    const refreshUrl = `https://${req.headers.host}/.auth/refresh`;
    req.tokenMiddleware.refreshedTokenResult = await refreshTokenInMiddleware(refreshUrl, req.tokenMiddleware.token);
  }
  return next();
}

app.use(refreshToken);
app.use('/', express.static('frontend/build'));

// app.get('/api', (req, res) => {
//   res.send('Hello, world!');
// });

app.get('/api', async (req, res) => {
  res.send(`Secret Value: ${process.env.KVsecret1}`);
});

app.post('/upload', upload.single('filename'), (req, res) => {
  const accessToken = req.headers['x-ms-token-aad-access-token'];
  const file = req.file;
  // Construct form-data to be sent to API1
  const formData = new FormData();
  formData.append('image', fs.createReadStream(file.path), file.originalname);

  // Set the headers for Axios request, including form-data boundary
  const headers = {
    ...formData.getHeaders(),
    'Authorization': `Bearer ${accessToken}`
  };

  // Make a POST request to API1 to upload the image
  axios.post(`${API1_BASE_URL}/UploadFile?`, formData, { headers })
    .then(apiResponse => res.json(apiResponse.data))
    .catch(error => {
      context.error('Error uploading to API1:', error);
      res.status(500).send('Error uploading image');
    });
});

// Endpoint to fetch images
app.get('/images', (req, res) => {
  // Make a GET request to API1 to fetch images
  res.json(mockImages);
  // const accessToken = req.headers['x-ms-token-aad-access-token'];
  // const headers = {
  //   'Authorization': `Bearer ${accessToken}`, // Add the Authorization header with the token
  // };

  // axios.get(`${API1_BASE_URL}/images`, { headers })
  //   .then(apiResponse => res.json(apiResponse.data))
  //   // .then(apiResponse => res.json(mockImages))
  //   .catch(error => {
  //     console.error('Error fetching images from API1:', error);
  //     res.status(500).send('Error fetching images');
  //   });
});

app.listen(port, () => {
  console.log('Server listening on port '+ port);
});

