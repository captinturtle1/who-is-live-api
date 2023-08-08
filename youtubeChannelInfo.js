import pretty from 'pretty';

export function youtubeChannelInfo(channels) {
    return new Promise((resolve, reject) => {
        // Fetch data from the URL
        fetch(`https://youtube.com/@${channels[0]}`)
        .then(response => response.text())
        .then(html => {
            let prettied = pretty(html); 
            let infoObject = {
                displayName: '',
                imageURL: '',
                verified: false,
                followers: 0,
                live: false,
                viewers: 0,
                title: '',
                catagory: '',
                tags: [],
            }

            if (prettied.match(/"text": "LIVE"/)) infoObject.live = true;
            if (prettied.match(/<link rel="image_src" href="([^"]*)"[^>]*>/)) {
                infoObject.imageURL = prettied.match(/<link rel="image_src" href="([^"]*)"[^>]*>/)[1];
            };
            if (prettied.match(/<meta property="og:title" content="([^"]*)"[^>]*>/)) {
                infoObject.displayName = prettied.match(/<meta property="og:title" content="([^"]*)"[^>]*>/)[1];
            };
            resolve([infoObject])
        })
        .catch(err => {
            reject(err);
        });
    });
}