/**
 * Publishes the Chrome build to Microsoft Edge Add-ons (Update REST API v1.1), used by the publish job of the CI workflow:
 *   node config/release/edge.js verify   - checks credentials against the API
 *   node config/release/edge.js publish  - uploads sl.zip to the draft submission and publishes it
 *
 * Configuration comes from:
 *   EDGE_PRODUCT_ID - Partner Center > Microsoft Edge > Overview > extension > Product ID
 *   EDGE_CLIENT_ID and EDGE_API_KEY - Partner Center > Microsoft Edge > Publish API
 * The API only updates existing products, the first version has to be submitted in Partner Center.
 */
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PACKAGE_PATH = path.resolve(ROOT, 'sl.zip');
const API = 'https://api.addons.microsoftedge.microsoft.com/v1';
const POLL_INTERVAL = 5_000;
const POLL_ATTEMPTS = 60;
const CERTIFICATION_NOTES = 'Built from https://github.com/TautvydasDerzinskas/super-linkomanija, the same package is published to the Chrome Web Store.';

function readCredentials() {
  const missing = ['EDGE_PRODUCT_ID', 'EDGE_CLIENT_ID', 'EDGE_API_KEY'].filter(name => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing Edge Add-ons configuration: ${missing.join(', ')}`);
  }
  return {
    productId: process.env.EDGE_PRODUCT_ID,
    headers: {
      Authorization: `ApiKey ${process.env.EDGE_API_KEY}`,
      'X-ClientID': process.env.EDGE_CLIENT_ID,
    },
  };
}

async function request(headers, method, url, body, contentType) {
  const response = await fetch(url, {
    method,
    body,
    headers: contentType ? { ...headers, 'Content-Type': contentType } : headers,
  });
  if (!response.ok) {
    throw new Error(`${method} ${url} failed with ${response.status}: ${await response.text()}`);
  }
  return response;
}

// Upload and publish both return an operation ID in the Location header, polled until it finishes
async function waitForOperation(headers, operationUrl, label) {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
    const operation = await (await request(headers, 'GET', operationUrl)).json();
    if (operation.status === 'Succeeded') {
      console.log(`${label} succeeded: ${operation.message}`);
      return;
    }
    if (operation.status !== 'InProgress') {
      throw new Error(`${label} failed (${operation.errorCode}): ${operation.message} ${JSON.stringify(operation.errors ?? [])}`);
    }
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }
  throw new Error(`${label} did not finish in time`);
}

function operationId(response) {
  const location = response.headers.get('Location');
  if (!location) {
    throw new Error('Edge Add-ons API response has no operation ID in its Location header');
  }
  return location.split('/').pop();
}

async function verify() {
  const { productId, headers } = readCredentials();
  // There is no read endpoint, so query a random operation: 404 means authenticated, 401 means bad credentials
  const response = await fetch(`${API}/products/${productId}/submissions/operations/${randomUUID()}`, { headers });
  if (response.status === 401 || response.status === 403) {
    throw new Error(`Edge Add-ons API rejected the credentials (${response.status}), check EDGE_CLIENT_ID and EDGE_API_KEY`);
  }
  console.log('Edge Add-ons credentials accepted');
}

async function publish() {
  const { productId, headers } = readCredentials();
  const productUrl = `${API}/products/${productId}/submissions`;

  const upload = await request(headers, 'POST', `${productUrl}/draft/package`, readFileSync(PACKAGE_PATH), 'application/zip');
  await waitForOperation(headers, `${productUrl}/draft/package/operations/${operationId(upload)}`, 'Edge Add-ons upload');

  const submission = await request(headers, 'POST', productUrl, JSON.stringify({ notes: CERTIFICATION_NOTES }), 'application/json');
  await waitForOperation(headers, `${productUrl}/operations/${operationId(submission)}`, 'Edge Add-ons publish');
}

const command = process.argv[2];
const commands = { verify, publish };
if (!commands[command]) {
  throw new Error(`Unknown command "${command}", expected "verify" or "publish"`);
}
await commands[command]();
