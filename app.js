const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const SEAL = require('node-seal');
const bodyParser = require('body-parser');
const cors = require('cors');
const secp = require('@noble/secp256k1');
const sha256 = require('sha256');
const VoteManager = require('./voteStateManager');

const app = express();
// app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

let candidates  = ["Anil", "Bablu", "Ramesh"];

// Placeholder for votes storage (address -> encrypted vote data)
let encryptedVotes = {};
let context, encryptor, evaluator, batchEncoder, decryptor, publicKey, secretKey;

// Initialize SEAL encryption context and objects
const initializeSEAL = async () => {
  const seal = await SEAL();

  // Encryption Parameters
  const schemeType = seal.SchemeType.bfv;
  const securityLevel = seal.SecurityLevel.tc128;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
  const bitSize = 20;

  const encParms = seal.EncryptionParameters(schemeType);
  encParms.setPolyModulusDegree(polyModulusDegree);
  encParms.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)),
  );
  encParms.setPlainModulus(
    seal.PlainModulus.Batching(polyModulusDegree, bitSize),
  );

  context = seal.Context(encParms, true, securityLevel);
  if (!context.parametersSet()) {
    throw new Error(
      "Could not set the parameters in the given context. Please try different encryption parameters.",
    );
  }

  const keyGenerator = seal.KeyGenerator(context);
  secretKey = keyGenerator.secretKey();
  publicKey = keyGenerator.createPublicKey();

  batchEncoder = seal.BatchEncoder(context);
  encryptor = seal.Encryptor(context, publicKey);
  evaluator = seal.Evaluator(context);
  decryptor = seal.Decryptor(context, secretKey);
};

// Initialize SEAL context
initializeSEAL().then(() => {
  console.log("SEAL encryption context initialized");
  // console.log(typeof encryptor);
}).catch(err => {
  console.error("Error initializing SEAL:", err);
});

// Route to get encryption parameters (returns encryptor, etc.)
app.post('/encryptor', async (req, res) => {
  if (!encryptor) {
    return res.status(500).json({ error: 'Encryption context is not initialized.' });
  }
  const data = req.body;
  console.log(data);
  // const cipherTextA = encryptor.encrypt(plainTextA);
  return res.status(200).json({ cipherText: serializedBase64 });
});
app.get('/candidates', (req, res) => {
  res.json({ candidates });
});

// Route to post vote (handle encrypted votes and digital signature)
app.post('/vote', (req, res) => {
  const { publicKey, arr, signature } = req.body;
  const sig = JSON.parse(signature, (key, value) =>
    /^\d+$/.test(value) && typeof value === "string" ? BigInt(value) : value
  );
  if (!verifySignature(arr, sig, publicKey)) {
    return res.status(200).json({ message: 'Invalid signature' });
  }
  const plainText = batchEncoder.encode(
    Int32Array.from(arr),
  );
  const obj = encryptor.encrypt(plainText);
  if( VoteManager.castVote(publicKey, obj)){
    // true means
    res.json({ message: 'Encrypted vote recorded successfully for id:'+ publicKey+"!" });
    return;
  }
  res.json({ message: 'You have already voted!' });
  return;
});

app.post('/generate', (req, res) => {
  let privateKey = secp.utils.randomPrivateKey();
  let publicKey = secp.getPublicKey(privateKey);
  console.log(typeof privateKey );
  res.json({ privateKey, publicKey });
});

// Placeholder function to simulate signature verification
const verifySignature = (message, signature, publicKey) => {
  const pk = hexToUint8Array(publicKey);
  console.log(pk, signature, sha256(message));
  return !secp.verify(signature, sha256(message), pk);

};

// Route to aggregate votes (here you'd decrypt and process votes)
app.get('/aggregateVotes', async (req, res) => {
  const allVotes = VoteManager.getAllVotes();
  const ret = [];
  for (const [key, value] of allVotes.entries()) {
    console.log(key, value);
    ret.push({ key, value: "voted" });
  }
  res.json({ message: 'Aggregated votes' , votes: ret});
});

app.get('/prooflog', async (req, res) => {
  const allVotes = VoteManager.getAllVotes();

  const cipherTextA = encryptor.encrypt(plainTextA);
  const answere = seal.CipherText();
  const logs = [];
  evaluator.add(cipherTextA, cipherTextA, cipherTextD);
  const plainTextD = decryptor.decrypt(cipherTextD);
  
  for (const [key, value] of allVotes.entries()) {
    console.log(key, value);
    logs.push({`Adding`});
    ret.push();
  }
  res.json({ message: 'Aggregated votes' , votes: ret});
});
// Route to reset votes (for testing)
app.post('/reset', (req, res) => {
  encryptedVotes = {}; // Clear stored votes
  res.json({ message: 'All votes have been reset!' });
});

// Secure server setup
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


// const hexString = Object.values(keyObject)
//   .map(value => value.toString(16).padStart(2, '0')) // Convert to hex and pad with 0 if needed
//   .join('');

function hexToUint8Array(hexString) {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string length.");
  }
  const pkey = secp.utils.randomPrivateKey();        
  for (let i = 0; i < hexString.length; i += 2) {
    pkey[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return pkey;
}