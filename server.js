const express = require("express");
const fetch = require("node-fetch");

const app = express();

function absoluteUrl(base, relative) {
  return new URL(relative, base).href;
}

app.get("/proxy", async (req, res) => {
  try {
    const target = req.query.url;

    if (!target) {
      return res.status(400).send("Missing URL");
    }

    const response = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://m4uplay.store/"
      },
      redirect: "follow"
    });

    const contentType =
      response.headers.get("content-type") || "";

    // HLS PLAYLIST
    if (
      contentType.includes("mpegurl") ||
      target.includes(".m3u8")
    ) {
      let text = await response.text();

      const lines = text.split("\n");

      const rewritten = lines.map((line) => {
        line = line.trim();

        if (
          line &&
          !line.startsWith("#")
        ) {
          const abs = absoluteUrl(target, line);

          return `/proxy?url=${encodeURIComponent(abs)}`;
        }

        return line;
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.apple.mpegurl"
      );

      res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
      );

      return res.send(rewritten.join("\n"));
    }

    // VIDEO SEGMENTS (.ts/.mp4/etc)
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

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
