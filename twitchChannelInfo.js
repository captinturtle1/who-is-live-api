import 'dotenv/config';
import fetch from 'node-fetch';

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
            accessToken = response.access_token;
            console.log('twitch token set');
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

function getTwitchUser(loginUrlParams) {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Client-Id': process.env.TWITCH_CLIENT_ID
                }
            };
            
            let response = await fetch(`https://api.twitch.tv/helix/users?${loginUrlParams}`, options);
            response = await response.json();
            resolve (response)
        } catch(err) {
            reject(err);
        }
    })
}

export function twitchChannelInfo(channels) {
    return new Promise(async (resolve, reject) => {
            try {
                // constructing api url for streams endpoint
                let urlParems = '';
                for (let i = 0; i < channels.length; i++) {
                    if (i == 0) {
                        urlParems = urlParems.concat('user_login=', channels[i]);
                    } else {
                        urlParems = urlParems.concat('&user_login=', channels[i]);
                    }
                }

                // constructing api url for users endpoint
                let loginUrlParems = '';
                for (let i = 0; i < channels.length; i++) {
                    if (i == 0) {
                        loginUrlParems = loginUrlParems.concat('login=', channels[i]);
                    } else {
                        loginUrlParems = loginUrlParems.concat('&login=', channels[i]);
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
                    }
                }

                let usersResponse = await getTwitchUser(loginUrlParems);
                if (usersResponse.error) {
                    reject(response);
                }
                
                response = response.data;
                usersResponse = usersResponse.data;
                
                let newDataArray = [];
                for (let i = 0; i < usersResponse.length; i++) {
                    let infoObject = {
                        name: usersResponse[i].login,
                        displayName: usersResponse[i].display_name,
                        profileImageURL: usersResponse[i].profile_image_url,
                        verified: usersResponse[i].broadcaster_type == 'partner',
                        live: false,
                        viewers: 0,
                        streamTitle: ''
                    }

                    // loop thru stream endpoint responses to find matching name for current users endpoint
                    for (let j = 0; j < response.length; j++) {
                        if (response[j].user_login == usersResponse[i].login) {
                            infoObject.live = true;
                            infoObject.viewers = response[j].viewer_count;
                            infoObject.streamTitle = response[j].title;
                        }
                    }
                    newDataArray.push(infoObject);
                }

                resolve(newDataArray)
            } catch(err) {
                console.log(err);
                reject(err);
            }
    });
}


