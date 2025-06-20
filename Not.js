const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/send-views', async (req, res) => {
  const { videoUrl, viewCount } = req.body;

  if (!videoUrl || !viewCount) return res.status(400).send("Missing data.");

  res.send(`📽️ Bot started for: ${videoUrl} | Views: ${viewCount}`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36'
  );

  for (let i = 0; i < parseInt(viewCount); i++) {
    try {
      console.log(`[${i + 1}] View started`);
      await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForTimeout(10000);
      console.log(`✅ View ${i + 1} done`);
    } catch (err) {
      console.error(`❌ Error on view ${i + 1}:`, err.message);
    }
  }

  await browser.close();
});

app.listen(port, () => {
  console.log(`🚀 Bot server running at http://localhost:${port}`);
});
