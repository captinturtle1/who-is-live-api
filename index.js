import express from 'express';
import cors from 'cors';

import { kickChannelInfo } from './kickChannelInfo.js';
import { twitchChannelInfo } from './twitchChannelInfo.js';
import { youtubeChannelInfo } from './youtubeChannelInfo.js';

const app = express();
app.use(express.json());

app.use(cors())

const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/kick', (req, res) => {
    console.log('Kick API', req.body)

    let isValid = true;
    for (let i = 0; i < req.body.length; i++) {
        if (isValid) {
            isValid = (req.body[i]).match(/^[a-zA-Z0-9_]+$/i);
        }
    }

    if (isValid) {
        kickChannelInfo(req.body).then(info => {
            console.log('request successful');
            res.status(200).json({ info });
        }).catch(() => {
            console.log('request failed');
            res.status(500).json({error: "Internal Server Error"})
        });
    } else {
        res.status(400).json({error: "Bad Request"});
    }
});

app.post('/twitch', (req, res) => {
    console.log('Twitch API', req.body)

    let isValid = true;
    for (let i = 0; i < req.body.length; i++) {
        if (isValid) {
            isValid = (req.body[i]).match(/^[a-zA-Z0-9_]+$/i);
        }
    }

    if (isValid) {
        twitchChannelInfo(req.body).then(info => {
            console.log('request successful');
            res.status(200).json({ info });
        }).catch(() => {
            console.log('request failed');
            res.status(500).json({error: "Internal Server Error"})
        });
    } else {
        res.status(400).json({error: "Bad Request"});
    }
});

app.post('/youtube', (req, res) => {
    console.log('Youtube API', req.body)

    let isValid = true;
    for (let i = 0; i < req.body.length; i++) {
        if (isValid) {
            isValid = (req.body[i]).match(/^[a-zA-Z0-9_]+$/i);
        }
    }

    if (isValid) {
        youtubeChannelInfo(req.body).then(info => {
            console.log('request successful');
            res.status(200).json({ info });
        }).catch((err) => {
            console.log('request failed', err);
            res.status(500).json({error: "Internal Server Error"})
        });
    } else {
        res.status(400).json({error: "Bad Request"});
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});