const puppeteer = require('puppeteer');
const { expect } = require('chai');
let page;

describe('technical test', async function() {
    before(async function () {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 25,
            timeout: 0,
            args: ['--start-maximized', '--no-sandbox', '--lang=fr-FR'],
            defaultViewport: {
                width: 1680,
                height: 900,
            }
        });
    });

    it('open browser, connect, verify title', async function() {
        page = await browser.newPage();
        await page.goto('http://localhost/prestashop/admin-dev');
        await page.type('#email', 'demo@prestashop.com');
        await page.type('#passwd', 'prestashop_demo');
        await page.click('#submit_login');
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        const pageTitle = await page.title();
        await expect(pageTitle).to.contains('Dashboard');
    });

    it ('check the first product is correct', async function() {
        if (await elementVisible(page, 'button.onboarding-button-shut-down')) {
            await page.click('button.onboarding-button-shut-down');
            await page.waitForSelector('a.onboarding-button-stop', {visible: true});
            await page.click('a.onboarding-button-stop');
        }
        await page.click('#subtab-AdminCatalog>a');
        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            page.click('#subtab-AdminProducts>a')
        ]);
        const nbrLines = (await page.$$('#product_catalog_list table tbody tr')).length;
        await expect(nbrLines).to.be.equal(19);
    });

    after(async function () {
        await browser.close();
    });
});

async function elementVisible(page, selector, timeout = 10) {
    try {
        await page.waitForSelector(selector, {visible: true, timeout});
        return true;
    } catch (error) {
        return false;
    }
}