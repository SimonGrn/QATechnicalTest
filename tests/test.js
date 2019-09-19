//node node_modules/mocha/bin/mocha tests/test.js --timeout 0

const puppeteer = require('puppeteer');
const { expect } = require('chai');
let page;

describe('technical test', async function() {
    before(async function () {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 250,
            timeout: 0,
            args: ['--no-sandbox', '--lang=en-EN'],
            defaultViewport: {
                width: 600,
                height: 400,
            }
        });
    });

    it('tests page', async function() {
        page = await browser.newPage();
        await page.goto('http://localhost/prestashop/admin-dev');
        await page.type('#email', 'demo@prestashop.com');
        await page.type('#passwd', 'prestashop_demo');
        await page.click('#submit_login');
        await page.waitFor(5000);
        const pageTitle = await page.title();
        await expect(pageTitle).to.be.equal('Dashboard');
    });

    it ('first', async function() {
        await page.click('button.onboarding-button-shut-down');
        await page.click('#subtab-AdminCatalog');
        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            page.click('#subtab-AdminProducts')
        ]);
        const nbrLines = (await page.$$('#product_catalog_list table tbody tr')).size();
        await expect(nbrLines).to.be.equal(20);
    });

    after(async function () {

    });
});