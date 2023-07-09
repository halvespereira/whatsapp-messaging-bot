const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sendMessages", async (req, res) => {
  try {
    function delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }

    console.log("req.body", req.body);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://web.whatsapp.com/");
    page.setDefaultTimeout(0);

    await page.waitForSelector('[data-testid="menu-bar-chat"]');
    await page.click('[data-testid="menu-bar-chat"]');
    await delay(2000);

    await page.waitForSelector('[data-testid="chat-list-search"]');
    await page.type('[data-testid="chat-list-search"]', "3187339163");
    await delay(2000);

    await page.waitForSelector('[data-testid="list-item-1"]');
    await page.click('[data-testid="list-item-1"]');
    await delay(2000);

    res.send("Hello World!");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
