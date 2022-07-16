import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import dotenv from 'dotenv';
dotenv.config();


const consumer_key = process.env.TWITTER_CONSUMER_KEY;
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;

const oAuthAccessToken = {
  oauth_token: process.env.TWITTER_OAUTH_TOKEN,
  oauth_token_secret: process.env.TWITTER_OAUTH_TOKEN_SECRET
}

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

async function getRequest({
  oauth_token,
  oauth_token_secret
}) {

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
    // Make the request
    console.log('TOKEN', oAuthAccessToken);
    const response = await getRequest(oAuthAccessToken);
    console.dir(response, {
      depth: null
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();