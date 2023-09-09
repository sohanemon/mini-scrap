const express = require('express');
const cors = require('cors');
const { default: puppeteer } = require('puppeteer');
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

app.get('/data', async (req, res) => {
  const url =
    'https://www.rated.network/o/snc.xyz?network=mainnet&timeWindow=all&viewBy=operator&page=1';
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url);

  const data = await p.evaluate(() => {
    const els = Array.from(
      document.querySelectorAll(
        '#scrollable-content > div > div.sc-325163d9-0.GTwVa > div.sc-4b1008c9-2.dapXRV > div > div > div.sc-f88de327-1.dkGjhX'
      )
    );
    return els.map((el) => el?.querySelector('h2')?.innerHTML);
  });
  await b.close();
  res.json({ data });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
