import pretty from 'pretty';

function parseViewers(viewerString) {
    let numArray = Array.from(viewerString);
    let followerNumArray = [];
    for (let i = 0; i < numArray.length; i++) {
        if (!isNaN(numArray[i])) {
            followerNumArray.push(numArray[i]);
        }
    }
    let viewersNum = parseInt(followerNumArray.join(''));
    return viewersNum;
}

export function youtubeChannelInfo(channels) {
    return new Promise((resolve, reject) => {
        // Fetch data from the URL
        fetch(`https://youtube.com/@${channels[0]}`)
        .then(response => response.text())
        .then(html => {
            let prettied = pretty(html); 
            let infoObject = {
                displayName: '',
                profileImageURL: '',
                verified: false,
                live: false,
                title: '',
                viewers: 0,
            }
            if (prettied.match(/"style": "BADGE_STYLE_TYPE_VERIFIED"/)) infoObject.verified = true;
            if (prettied.match(/"text": "LIVE"/)) {
                infoObject.live = true

                let matchedViewers = prettied.match(/"viewCountText"\s*:\s*{\s*"runs"\s*:\s*\[\s*{\s*"text"\s*:\s*"([^"]+)"/);
                infoObject.viewers = parseViewers(matchedViewers[1]);
            };
            if (prettied.match(/<link rel="image_src" href="([^"]*)"[^>]*>/)) {
                infoObject.profileImageURL = prettied.match(/<link rel="image_src" href="([^"]*)"[^>]*>/)[1];
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