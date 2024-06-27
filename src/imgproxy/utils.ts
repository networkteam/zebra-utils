export const urlSafeBase64 = (value: string | Buffer) => {
  return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

export const hexDecode = (string: string) => Buffer.from(string, 'hex');

export const sign = async (salt: string, target: string, secret: string) => {
  const secretData = hexDecode(secret);
  const saltData = hexDecode(salt);
  const targetData = new TextEncoder().encode(target);
  const algorithm = { name: 'HMAC', hash: 'SHA-256' };

  // Import the secret key for use in the HMAC algorithm
  const cryptoKey = await crypto.subtle.importKey('raw', secretData, algorithm, false, ['sign', 'verify']);

  // Create a new ArrayBuffer to concatenate saltData and targetData
  const data = new Uint8Array(saltData.byteLength + targetData.byteLength);
  data.set(new Uint8Array(saltData), 0);
  data.set(targetData, saltData.byteLength);

  // Sign the data using HMAC-SHA256
  const signature = await crypto.subtle.sign(algorithm, cryptoKey, data);

  // Convert the signature to URL-safe base64
  const digest = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const hash = digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return hash;
};
