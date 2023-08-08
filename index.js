import express from 'express';

import { kickChannelInfo } from './kickChannelInfo.js';
import { twitchChannelInfo } from './twitchChannelInfo.js';
import { youtubeChannelInfo } from './youtubeChannelInfo.js';

const app = express();
app.use(express.json());

const port = 1337

app.post('/kick', (req, res) => {
    console.log('Kick API', req.body)
    kickChannelInfo(req.body).then(info => {
        console.log('request successful');
        res.status(200).json({ info });
    }).catch(() => {
        console.log('request failed');
        res.status(500).json({error: "Internal Server Error"})
    });
});

app.post('/twitch', (req, res) => {
    console.log('Twitch API', req.body)
    twitchChannelInfo(req.body).then(info => {
        console.log('request successful');
        res.status(200).json({ info });
    }).catch(() => {
        console.log('request failed');
        res.status(500).json({error: "Internal Server Error"})
    });
});

app.post('/youtube', (req, res) => {
    console.log('Youtube API', req.body)
    youtubeChannelInfo(req.body).then(info => {
        console.log('request successful');
        res.status(200).json({ info });
    }).catch((err) => {
        console.log('request failed');
        console.log(err);
        res.status(500).json({error: "Internal Server Error"})
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});