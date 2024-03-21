const express = require('express');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const app = express();
const port = process.env.PORT || 3000

const keyVaultName = "assign4KV";
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net/`;
const secretName = "secret1";

const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);

app.use('/', express.static('frontend/build'));

// app.get('/api', (req, res) => {
//   res.send('Hello, world!');
// });

app.get('/api', async (req, res) => {
  res.send(`Secret Value: ${process.env.KVsecret1}`);
});

app.listen(port, () => {
  console.log('Server listening on port '+ port);
});

