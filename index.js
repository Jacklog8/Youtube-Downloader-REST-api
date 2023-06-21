const express = require(`express`);
const app = express();
const PORT = 8080;

const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const exp = require('constants');

app.get(`/debug/info/:id`, async (req, res) => {
    let info;

    try
    {
        info = await ytdl.getInfo(`https://www.youtube.com/watch?v=`+req.params.id);
    }
    catch(e)
    {
        res.status(400).send({
            error_name: e.name,
            error_message: e.message
        });
        return;
    }

    res.status(200).send(info);
});

app.get(`/id/:id`, async (req, res) => {
    let info;

    try
    {
        info = await ytdl.getInfo(`https://www.youtube.com/watch?v=`+req.params.id);
    }
    catch(e)
    {
        res.status(400).send({
            error_name: e.name,
            error_message: e.message
        });
        return;
    }

    res.status(308);
    res.setHeader(`Location`, `/download/`+req.params.id+`/`+info.videoDetails.title.replace(`?`, "")+`.mp4`);
    res.end();
});

app.get(`/url`, async (req, res) => {
    let info;

    try
    {
        info = await ytdl.getInfo(req.query.url);
    }
    catch(e)
    {
        res.status(400).send({
            error_name: e.name,
            error_message: e.message
        });
        return;
    }

    res.status(308);
    res.setHeader(`Location`, `/download/`+ytdl.getVideoID(req.query.url)+`/`+info.videoDetails.title+`.mp4`);
    res.end();
});

app.get(`/download/:id/:title.mp4`, async (req, res) => {
    const download = ytdl(`https://www.youtube.com/watch?v=`+req.params.id);
    const video = await stream2buffer(download)

    res.status(200).send(video);
});

function stream2buffer(stream) {

    return new Promise((resolve, reject) => {
        const _buf = [];

        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));
    });
}

app.listen(
    PORT,
    () => console.log(`Listening on http://localhost:${PORT}...\nGo to http://localhost:${PORT}/id/\{video id} or http://localhost:${PORT}/url?url=\{video url} to download youtube video!`)
);