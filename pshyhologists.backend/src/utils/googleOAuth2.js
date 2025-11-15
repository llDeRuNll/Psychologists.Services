// src/utils/googleOAuth2.js
import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

// 1) беремо redirect з ENV, 2) якщо нема — з файлу, 3) якщо нема — помилка
let redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

if (!redirectUri) {
  try {
    const raw = await readFile(PATH_JSON, 'utf8');
    const parsed = JSON.parse(raw);
    redirectUri = parsed?.web?.redirect_uris?.[0];
  } catch (err) {
    if (err.code !== 'ENOENT') throw err; // інші помилки файлу — пробросити
  }
}

if (!redirectUri) {
  throw new Error(
    'Missing Google OAuth redirect URI. Set env GOOGLE_OAUTH_REDIRECT_URI or provide google-oauth.json',
  );
}

const googleOAuthClient = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri,
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};
