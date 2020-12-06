const fs = require('fs')
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: 'ipc'
});
let song = require('./np.json');

function refresh() {
    delete require.cache[require.resolve('./np.json')]
    return song = require('./np.json');
}

rpc.on('ready', () => {
    try {
        setActivity(song)
    } catch (error) {
        console.error(error);
    };

    setInterval(() => {
        try {
            fs.readFile('./np.json', 'utf8', (err, jsonString) => {
                if (err) {
                    console.log("File read failed:", err)
                    return
                }
                if (JSON.stringify(song) !== jsonString) {
                    refresh()
                    setActivity(song)
                };
            });
        } catch (error) {
            console.error(error);
        };
    }, 1);//2e3

    console.log('Connected!');
});

function setActivity(song) {
    rpc.setActivity({
        details: `🎶 ${song.track.title}`,
        state: `👤 ${song.track.artistsString}`,
        startTimestamp:  Date.now(),
        largeImageKey: 'pretzel',
        largeImageText: 'Pretzel Rocks',
        smallImageKey: smallKey(song),
        smallImageText: smallText(song)
    });
    console.log(`Now playing: ${song.track.title} - ${song.track.artistsString}`) //https://api.pretzel.tv/playing/twitch/194798600
};

function smallKey(song) {
    if (song.player.playing === true) {
        return 'play'
    } else {
        return 'pause'
    }
};

function smallText(song) {
    if (song.player.playing === true) {
        return 'Playing'
    } else {
        return 'Paused'
    }
};

rpc.login({
    clientId: '784497631186649108'
});