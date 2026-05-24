const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/proxy", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing URL");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://m4uplay.store/"
      }
    });

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    response.body.pipe(res);
  } catch (e) {
    res.status(500).send("Proxy error");
  }
});

app.listen(process.env.PORT || 3000);
