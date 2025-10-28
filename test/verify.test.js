const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create a function named `calculateAward` that takes one parameter `points` and returns the string "First Place" when `points` are over 99', async function() {
      const result = await page.evaluate(() => {
        return calculateAward(100);
      });

      expect(result).toBe("First Place");
  });

  it('should return the string "Second Place" when `points` are over 49 and under 100', async function() {
      const result = await page.evaluate(() => {
        return calculateAward(99);
      });

      expect(result).toBe("Second Place");       
  });

  it('should return the string "Participation Award" for everything else', async function() {
      const result = await page.evaluate(() => {
        return calculateAward(49);
      });

      expect(result).toBe("Participation Award");              
  });
});

