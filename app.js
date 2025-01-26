const express = require('express');
const https = require('https');
const fs = require('fs');


const app = express();

app.use(express.json());

let candidates = {
  "Alice": 0,
  "Bob": 0,
  "Charlie": 0,
};

app.get('/candidates', (req, res) => {
  res.json(candidates);
});

app.post('/vote', (req, res) => {
  const { candidate } = req.body;
  if (candidates[candidate] !== undefined) {
    candidates[candidate]++;
    res.json({ message: `Vote for ${candidate} recorded!`, votes: candidates[candidate] });
  } else {
    res.status(400).json({ error: 'Candidate not found' });
  }
});

app.post('/reset', (req, res) => {
  for (let key in candidates) {
    candidates[key] = 0;
  }
  res.json({ message: 'All votes have been reset!' });
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  },
  app
);

sslServer.listen(3443, () => {
  console.log("Secure voting app is running on https://localhost:3443");
});