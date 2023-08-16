import 'dotenv/config';

let accessToken = '';

// get inital access_token
function getAccessToken() {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },    
                body: new URLSearchParams({
                    'client_id': process.env.TWITCH_CLIENT_ID,
                    'client_secret': process.env.TWITCH_CLIENT_SECRET,
                    'grant_type': 'client_credentials'
                })
            };
            
            let response = await fetch('https://id.twitch.tv/oauth2/token', options);
            response = await response.json();
            console.log('token set', response);
            accessToken = response.access_token;
            resolve();
        } catch(err) {
            reject(err);
        }
    });
}
getAccessToken();

function fetchTwitch(urlParems) {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Client-Id': process.env.TWITCH_CLIENT_ID
                }
            };

            let response = await fetch(`https://api.twitch.tv/helix/streams?${urlParems}`, options);
            response = await response.json();

            resolve(response);
        } catch(err) {
            reject(err);
        }
    });
}

export function twitchChannelInfo(channels) {
    return new Promise(async (resolve, reject) => {
            try {
                // constructing twitch api url
                let urlParems = '';
                for (let i = 0; i < channels.length; i++) {
                    if (i == 0) {
                        urlParems = urlParems.concat('user_login=', channels[i]);
                    } else {
                        urlParems = urlParems.concat('&user_login=', channels[i]);
                    }
                }

                let response = await fetchTwitch(urlParems);

                // check if api gave an error, and get a new access token if so
                if (response.error) {
                    console.log('had error, getting new token');

                    // if token is invalid, get a new token and fetch again
                    await getAccessToken();
                    let response = await fetchTwitch(urlParems);

                    // check if api gave an error, and reject if so
                    if (response.error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                } else {
                    // if token is already good
                    resolve(response);
                }
            } catch(err) {
                reject(err);
            }
    });
}


