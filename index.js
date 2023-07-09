const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/sendMessages", async (req, res) => {
  try {
    function delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }

    const customers = req.body.customers;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://web.whatsapp.com/");
    page.setDefaultTimeout(0);

    await page.waitForSelector('[data-testid="menu-bar-chat"]');

    for (const customer of customers) {
      const message = `Olá ${customer.nome}, Jato de Areia agradece  a nossa parceria. Segue nossa tabela!`;

      await page.click('[data-testid="menu-bar-chat"]');
      await delay(2000);

      await page.waitForSelector('[data-testid="chat-list-search"]');
      await page.type('[data-testid="chat-list-search"]', customer.whatsapp);
      await delay(2000);

      await page.waitForSelector(
        '[data-testid="contact-list-key"] > div > div > div > [role="button"]'
      );
      await page.click(
        '[data-testid="contact-list-key"] > div > div > div > [role="button"]'
      );

      await page.waitForSelector(
        '[data-testid="conversation-compose-box-input"]'
      );
      await page.type(
        '[data-testid="conversation-compose-box-input"]',
        message
      );
      await delay(2000);
      await page.waitForSelector('[data-testid="send"]');
      await page.click('[data-testid="send"]');

      await page.waitForSelector('[data-testid="conversation-clip"]');
      await page.click('[data-testid="conversation-clip"]');
      await delay(2000);

      await page.waitForSelector('[data-testid="attach-document"]');
      await delay(2000);

      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('[data-testid="attach-document"]'),
      ]);
      await fileChooser.accept(["./public/imagens/Tabela.png"]);
      await delay(2000);

      await page.waitForSelector('[data-testid="send"]');
      await page.click('[data-testid="send"]');
      await delay(2000);
    }

    res.send({ message: "ok" });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
