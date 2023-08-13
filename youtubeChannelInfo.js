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
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch data from the URL
            async function getInfo(channelName) {
                let response = await fetch(`https://youtube.com/@${channelName}`);
                let html = await response.text();
                let prettied = pretty(html); 

                let infoObject = {
                    displayName: '',
                    profileImageURL: '',
                    verified: false,
                    live: false,
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

                return infoObject;
            }
            
            let newDataArray = [];
            for (let i = 0; i < channels.length; i++) {
                let newInfoObject = await getInfo(channels[i]);
                newDataArray.push(newInfoObject);
            }

            resolve(newDataArray);
        } catch(err) {
            reject(err)
        } 
    });
}