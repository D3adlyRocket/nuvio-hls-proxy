const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/proxy", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send("Missing URL");
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://m4uplay.store/"
      },
      redirect: "follow"
    });

    const contentType =
      response.headers.get("content-type") ||
      "application/vnd.apple.mpegurl";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    response.body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Proxy running on port " + PORT);
});
