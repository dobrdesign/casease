const express = require('express');
const puppeteer = require('puppeteer-core'); // puppeteer-core без скачки хрома
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/mew', async (req, res) => {
  const amount = parseFloat(req.query.amount || '0');
  if (amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const url = `https://casemirror.kesug.com/mew.php?amount=${amount}`;

  try {
    const browser = await puppeteer.launch({
      executablePath: '/opt/render/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.evaluate(() => document.body.innerText);
    await browser.close();

    try {
      const json = JSON.parse(content);
      return res.json(json);
    } catch {
      return res.status(500).json({ error: 'Failed to parse response', raw: content });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
