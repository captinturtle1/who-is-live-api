import 'dotenv/config';

let accessToken = '';

// get inital access_token
fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
        'client_id': process.env.TWITCH_CLIENT_ID,
        'client_secret': process.env.TWITCH_CLIENT_SECRET,
        'grant_type': 'client_credentials'
    })
})
.then((response) => response.json())
.then((data) => accessToken = data.access_token)
.catch(console.log);

export function twitchChannelInfo(channels) {
    return new Promise((resolve, reject) => {
            try {
                let urlParems = '';
                for (let i = 0; i < channels.length; i++) {
                    if (i == 0) {
                        urlParems = urlParems.concat('user_login=', channels[i]);
                    } else {
                        urlParems = urlParems.concat('&user_login=', channels[i]);
                    }
                }
                fetch(`https://api.twitch.tv/helix/streams?${urlParems}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Client-Id': process.env.TWITCH_CLIENT_ID
                    }
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.log('had error, getting new token')
                        // if token is invalid, get a new token
                        fetch('https://id.twitch.tv/oauth2/token', {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },    
                            body: new URLSearchParams({
                                'client_id': process.env.TWITCH_CLIENT_ID,
                                'client_secret': process.env.TWITCH_CLIENT_SECRET,
                                'grant_type': 'client_credentials'
                            })
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            // setting new token
                            accessToken = data.access_token;
                            // trying to get streams again with new token set
                            fetch(`https://api.twitch.tv/helix/streams?${urlParems}`, {
                                method: "GET",
                                headers: {
                                    'Authorization': 'Bearer ' + accessToken,
                                    'Client-Id': process.env.TWITCH_CLIENT_ID
                                }
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.error) {
                                    reject();
                                } else {
                                    resolve(data);
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            reject();
                        })
                    } else {
                        // if token is good
                        resolve(data);
                    }
                })
            } catch(err) {
                console.log(err);
                reject();
            }
    });
}


