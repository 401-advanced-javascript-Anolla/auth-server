'use strict';

// from GH docs Request a user's GitHub identity
const URL = 'https://github.com/login/oauth/authorize';
// needed query string

const options = {
  client_id: 'f9f8388d65e79b318fd3', //required!!
  scope: 'read:user',
  state: 'class-12',
};

// converting the obj to string and formatting the resulting string
const queryString = Object.keys(options)
  .map((key) => {
    return `${key}=${encodeURIComponent(options[key])}`;
  })
  .join('&');

// console.log('Query', queryString);
// making the full url
const authUrl = `${URL}?${queryString}`;
// console.log('Query', authUrl);
const link = document.getElementById('oauth');
link.setAttribute('href', authUrl);