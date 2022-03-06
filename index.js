const express = require('express');
const fetch = require('node-fetch');
const { bot_id } = require('./config.json');

const app = express();
const stats = {};
let ready = false;

const fetchStats = async () => {
    try {
        const res = await (await fetch(`https://top.gg/api/bots/${bot_id}`, {
            headers: {
                'Authorization':  process.env.TOKEN
            }
        })).json();

        stats.servers = res.server_count;
        stats.shards = res.shard_count;
        stats.monthlyVotes = res.monthlyPoints
        stats.totalVotes = res.points;

        if (!ready) ready = true;
    }
    catch (e) {
        console.log(e);
    }
}

const init = () => {
    fetchStats().then(() => ready=true);

    setInterval(() => {
        fetchStats();
    }, 10 * 60 * 1000);
};

init();

app.get('/stats', (_req, res) => {
    if (!ready) return res.status(503).send('Not ready');

    res.status(200).json({
        servers: stats.servers,
        monthlyVotes: stats.monthlyVotes,
        totalVotes: stats.totalVotes,
        shards: stats.shards,
    })
});

app.listen(process.env.PORT || 8080);