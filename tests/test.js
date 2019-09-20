//node node_modules/mocha/bin/mocha tests/test.js --timeout 0

const puppeteer = require('puppeteer');
const { expect } = require('chai');
let page;

describe('technical test', async function() {
    before(async function () {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 250,
            timeout: 1000,
            args: ['--no-sandbox', '--lang=en-EN'],
            defaultViewport: {
                width: 600,
                height: 400,
            }
        });
    });

    it('first test', async function() {
        page = await browser.newPage();
        await page.goto('http://localhost/prestashop/admin-dev');
        await page.type('#email', 'demo@prestashop.com');
        await page.type('#passwd', 'prestashop_demo');
        await page.click('#submit_login');
        await page.waitFor(5000);
    });

    it('second test', async function() {
        await page.click('button.onboarding-button-shut-down');
        await page.click('#subtab-AdminCatalog');
        await page.click('#subtab-AdminProducts');
        await page.waitFor(5000);
        const nbrLines = (await page.$$('#product_catalog_list table tbody tr')).size();
        await expect(nbrLines).to.be.equal(20);
    });
});