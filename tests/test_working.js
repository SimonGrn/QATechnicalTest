const puppeteer = require('puppeteer');
const {expect} = require('chai');

//data used in this test
const LOGIN = process.env.LOGIN || 'demo@prestashop.com';
const PASSWORD = process.env.PASSWORD || 'prestashop_demo';
const URL_BO = process.env.URL_BO || 'http://localhost/prestashop/admin-dev';

//variables
let page;


describe('Connect to BO and verify the list of products', async function() {
    //executed before the test : create a browser instance
    before(async function () {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 10,
            timeout: 0,
            args: ['--start-maximized', '--no-sandbox', '--lang=en-EN'],
            defaultViewport: {
                width: 1680,
                height: 900,
            }
        });
    });

    //First test: open the browser, go to the BO, login, and verify we're on the correct page
    it('should open the browser and login to the BO', async function() {
        page = await browser.newPage();
        await page.goto(URL_BO);
        await page.type('#email', LOGIN);
        await page.type('#passwd', PASSWORD);
        await page.click('#submit_login');
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        const pageTitle = await page.title();
        await expect(pageTitle).to.contains('Dashboard');
    });

    //Second test: go to the product page and check the list has the correct number of items (19)
    it ('should check the list of products is correct', async function() {
        if (await isElementVisible(page, 'button.onboarding-button-shut-down')) {
            //close the welcome modal
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

//method to check if an element is visible
async function isElementVisible(page, selector, timeout = 10) {
    try {
        await page.waitForSelector(selector, {visible: true, timeout});
        return true;
    } catch (error) {
        return false;
    }
}