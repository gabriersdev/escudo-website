import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, hash } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!hash) {
      return NextResponse.json(
        { error: 'Invalid transaction: Hash is missing' },
        { status: 403 }
      );
    }

    const secretKeyHex = process.env.HASH_VALIDATION_TRANSACTION;
    if (!secretKeyHex) {
      console.error('HASH_VALIDATION_TRANSACTION is not defined in environment variables');
      return NextResponse.json(
        { error: 'Internal Server Error: Missing security configuration' },
        { status: 500 }
      );
    }

    try {
      // hash format is expected to be iv:encrypted_payload
      const [ivHex, encryptedHex] = hash.split(':');
      if (!ivHex || !encryptedHex) throw new Error('Invalid hash format');

      const iv = Buffer.from(ivHex, 'hex');
      const secretKey = Buffer.from(secretKeyHex, 'hex');
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      if (decrypted !== 'escudo_newsletter_valid_transaction') {
        throw new Error('Invalid transaction signature');
      }
    } catch (err) {
      console.error('Validation failed:', err);
      return NextResponse.json(
        { error: 'Forbidden: Invalid transaction' },
        { status: 403 }
      );
    }

    const endpoint = process.env.NEWSLETTER_ENDPOINT;

    if (!endpoint) {
      console.error('NEWSLETTER_ENDPOINT is not defined in environment variables');
      return NextResponse.json(
        { error: 'Internal Server Error: Missing configuration' },
        { status: 500 }
      );
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = { success: true };
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
