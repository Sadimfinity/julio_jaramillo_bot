import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import dotenv from 'dotenv';
import genius from 'genius-lyrics-api';
import { songs } from './songs.js'
dotenv.config();


const consumer_key = process.env.TWITTER_CONSUMER_KEY;
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;

const oAuthAccessToken = {
  oauth_token: process.env.TWITTER_OAUTH_TOKEN,
  oauth_token_secret: process.env.TWITTER_OAUTH_TOKEN_SECRET
}

const options = {
	apiKey: process.env.GENIUS_ACCESS_TOKEN,
  title: undefined,
	artist: 'Julio Jaramillo',
	optimizeQuery: true
};

const data = {
  "text": "Hello world!"
};

const endpointURL = `https://api.twitter.com/2/tweets`;

// this example uses PIN-based OAuth to authorize the user
const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function getRawLyrics() {
  const randomSongTitle = getRandomTitle();
  options.title = randomSongTitle;
  return await genius.getLyrics(options)
}

function getRandomTitle() {
  return songs[Math.floor(Math.random() * songs.length)]
}

function filterLyrics(lyrics) {
  lyrics = lyrics.split('\n');
  lyrics = lyrics.filter(Boolean)
  lyrics = lyrics.filter(line => !(line.startsWith('(') || line.startsWith('*')));
  lyrics = lyrics.filter(line => !(line.startsWith('[') || line.toLowerCase().trim() == 'coro'));
  return lyrics;
}

function pickRandomNumberForLines() {
  return Math.floor(Math.random() * 3) + 2;
}

function getRandomIndex(size, numberOfLines) {
  return Math.floor(Math.random() * (size - numberOfLines))
}

function getTweetFrom(lyrics) {
  const numberOfLines = pickRandomNumberForLines();
  const index = getRandomIndex(lyrics.length, numberOfLines);
  let tweet = '';
  for (let i = index; i < index + numberOfLines; i++) {
    if(i === index + numberOfLines - 1) tweet = tweet + lyrics[i]
    else tweet = tweet + lyrics[i] + '/n';
  }
  tweet = tweet.replace('\\', '');
  return tweet;
}



async function getRequest(
  { oauth_token,
    oauth_token_secret }) {

  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const authHeader = oauth.toHeader(oauth.authorize({
    url: endpointURL,
    method: 'POST'
  }, token));

  const req = await got.post(endpointURL, {
    json: data,
    responseType: 'json',
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });
  if (req.body) {
    return req.body;
  } else {
    throw new Error('Unsuccessful request');
  }
}


(async () => {
  try {
    let lyrics = await getRawLyrics();
    lyrics = filterLyrics(lyrics);
    const tweet = getTweetFrom(lyrics);
    console.log('Tweet', tweet);

    // const response = await getRequest(oAuthAccessToken);
    // console.dir(response, {
    //   depth: null
    // });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();