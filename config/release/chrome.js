/**
 * Publishes the Chrome build to the Chrome Web Store (API v2), used by semantic-release:
 *   node config/release/chrome.js verify   - checks credentials and access to the store item
 *   node config/release/chrome.js publish  - uploads sl.zip and submits it for publishing
 *
 * Credentials come from:
 *   CWS_SERVICE_ACCOUNT_KEY - JSON key of a Google Cloud service account added to the publisher
 *   CWS_PUBLISHER_ID        - publisher ID from the Chrome Web Store developer dashboard
 */
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const EXTENSION_ID = 'gmdhkalbljdblbogfladannflinppnji';
const PACKAGE_PATH = path.resolve(ROOT, 'sl.zip');
const SCOPE = 'https://www.googleapis.com/auth/chromewebstore';
const API = 'https://chromewebstore.googleapis.com';
const UPLOAD_POLL_INTERVAL = 5_000;
const UPLOAD_POLL_ATTEMPTS = 60;

function readCredentials() {
  const missing = ['CWS_SERVICE_ACCOUNT_KEY', 'CWS_PUBLISHER_ID'].filter(name => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing Chrome Web Store credentials: ${missing.join(', ')}`);
  }

  let key;
  try {
    key = JSON.parse(process.env.CWS_SERVICE_ACCOUNT_KEY);
  } catch {
    throw new Error('CWS_SERVICE_ACCOUNT_KEY must be the full JSON key file of the service account');
  }
  if (!key.client_email || !key.private_key) {
    throw new Error('CWS_SERVICE_ACCOUNT_KEY is missing client_email or private_key');
  }

  return { key, publisherId: process.env.CWS_PUBLISHER_ID };
}

// OAuth 2.0 JWT bearer flow for service accounts: https://developers.google.com/identity/protocols/oauth2/service-account
async function getAccessToken(key) {
  const tokenUri = key.token_uri || 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: key.client_email,
    scope: SCOPE,
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');

  const response = await fetch(tokenUri, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Could not get a Google access token: ${body.error_description || body.error || response.status}`);
  }
  return body.access_token;
}

async function request(token, method, url, body) {
  const response = await fetch(url, { method, body, headers: { Authorization: `Bearer ${token}` } });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${url} failed with ${response.status}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

async function verify() {
  const { key, publisherId } = readCredentials();
  const token = await getAccessToken(key);
  const status = await request(token, 'GET', `${API}/v2/publishers/${publisherId}/items/${EXTENSION_ID}:fetchStatus`);
  console.log(`Chrome Web Store access verified, published: ${status.publishedItemRevisionStatus?.state ?? 'none'}, submitted: ${status.submittedItemRevisionStatus?.state ?? 'none'}`);
}

async function publish() {
  const { key, publisherId } = readCredentials();
  const token = await getAccessToken(key);
  const itemUrl = `${API}/v2/publishers/${publisherId}/items/${EXTENSION_ID}`;

  const upload = await request(token, 'POST', `${API}/upload/v2/publishers/${publisherId}/items/${EXTENSION_ID}:upload`, readFileSync(PACKAGE_PATH));
  let uploadState = upload.uploadState;
  for (let attempt = 0; ['IN_PROGRESS', 'UPLOAD_IN_PROGRESS'].includes(uploadState); attempt++) {
    if (attempt >= UPLOAD_POLL_ATTEMPTS) {
      throw new Error('Chrome Web Store did not finish processing the upload in time');
    }
    await new Promise(resolve => setTimeout(resolve, UPLOAD_POLL_INTERVAL));
    uploadState = (await request(token, 'GET', `${itemUrl}:fetchStatus`)).lastAsyncUploadState;
  }
  if (uploadState !== 'SUCCEEDED') {
    throw new Error(`Chrome Web Store upload ended in state ${uploadState}: ${JSON.stringify(upload)}`);
  }
  console.log(`Uploaded version ${upload.crxVersion} to the Chrome Web Store`);

  const result = await request(token, 'POST', `${itemUrl}:publish`);
  console.log(`Submitted for publishing, state: ${result.state}`);
  if (result.warningInfo) {
    console.warn(`Chrome Web Store warnings: ${JSON.stringify(result.warningInfo)}`);
  }
}

const command = process.argv[2];
const commands = { verify, publish };
if (!commands[command]) {
  throw new Error(`Unknown command "${command}", expected "verify" or "publish"`);
}
await commands[command]();
