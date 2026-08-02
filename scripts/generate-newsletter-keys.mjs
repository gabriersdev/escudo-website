import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const validPhrase = 'escudo_newsletter_valid_transaction';

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

console.log('\n--- Newsletter Security Keys Generation ---\n');
console.log('Backend Secret Key (add to your .env):');
console.log(`HASH_VALIDATION_TRANSACTION=${hexSecretKey}`);
console.log('\nFrontend Public Token (add to your .env):');
console.log(`NEXT_PUBLIC_HASH_VALIDATION_TRANSACTION=${publicToken}`);
console.log('\n-------------------------------------------\n');
