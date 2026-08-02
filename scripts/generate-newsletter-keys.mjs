import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const validPhrase = '';

if (validPhrase.trim().length < 1) {
  throw new Error('Invalid phrase');
}

// Generate a random 32-byte secret key
const secretKey = crypto.randomBytes(32);
const hexSecretKey = secretKey.toString('hex');

// Generate an initialization vector
const iv = crypto.randomBytes(16);

// Encrypt the valid phrase
const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
let encrypted = cipher.update(validPhrase, 'utf8', 'hex');
encrypted += cipher.final('hex');

// The public token includes the IV so it can be decrypted
// Format: iv:encrypted_payload
const publicToken = `${iv.toString('hex')}:${encrypted}`;

console.log()
console.log('Newsletter Security Keys Generation');
console.log()
console.log('Backend Secret Key (add to your .env):');
console.log(`${hexSecretKey}`);
console.log()
console.log('Frontend Public Token (add to your .env):');
console.log(`${publicToken}`);
console.log();
