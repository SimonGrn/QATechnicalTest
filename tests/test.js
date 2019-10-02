//node node_modules/mocha/bin/mocha tests/test.js --timeout 0

const puppeteer = require('puppeteer');
const { expect } = require('chai');
let browser;
let page;

describe('technical test', async function() {
    it('first test', async function() {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 250,
            timeout: 100,
            args: ['--no-sandbox', '--lang=en-EN'],
            defaultViewport: {
                width: 600,
                height: 400,
            }
        });
        page = await browser.newPage();
        await page.goto('http://localhost/prestashop/admin-dev');
        await page.type('#email', 'demo@prestashop.com');
        await page.type('#passwd', 'prestashop_demo');
        await page.click('#submit_login');
        await page.waitFor(5000);
        await console.log(page.title());
        await page.click('button.onboarding-button-shut-down');
        await page.click('#subtab-AdminCatalog');
        await page.click('#subtab-AdminProducts');
        await page.waitFor(5000);
        const nbrLines = (await page.$$('#product_catalog_list table tbody tr')).size();
        console.log(nbrLines+' should be equal to 20');
        await browser.close();
    });

    it('second test', async function() {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 250,
            timeout: 100,
            args: ['--no-sandbox', '--lang=en-EN'],
            defaultViewport: {
                width: 600,
                height: 400,
            }
        });
        page = await browser.newPage();
        await page.goto('http://localhost/prestashop/');
        await page.click('#content > section > div > article:nth-child(1) > div > a');
        await page.waitFor(5000);
        await page.click('#add-to-cart-or-refresh > div.product-add-to-cart > div > div.add > button');
        await page.waitFor(5000);
        const modal = await page.waitFor('#blockcart-modal[style="display: block;"]');
        await console.log(modal);
        await page.waitFor(500);
        await browser.close();
    });
});
