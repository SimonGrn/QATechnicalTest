const puppeteer = require('puppeteer');
const {expect} = require('chai');

//data used in this test
const LOGIN = process.env.LOGIN || 'demo@prestashop.com';
const PASSWORD = process.env.PASSWORD || 'prestashop_demo';
const URL_FO = process.env.URL_FO || 'http://localhost/prestashop';
const URL_BO = process.env.URL_BO || `${URL_FO}/admin-dev`;

//variables
let page;
let products = [
  'Customizable mug',
  'Hummingbird notebook',
  'Brown bear notebook',
  'Mountain fox Fnotebook',
  'Pack Mug + Framed poster',
  'Hummingbird - Vector graphics'
];


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

    //executed after the test: close the browser
    after(async function () {
        await browser.close();
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

    //Third test: go to the product page and check that the 6 first products are the correct ones
    it ('should check the list of products is correct', async function() {
        let productTableLines = await page.evaluate(() => {
            const trs = Array.from(document.querySelectorAll('table.table.product tbody tr'));
            return trs.map(tr => tr.querySelector('td:nth-child(4)').innerText);
        });
        productTableLines = productTableLines.slice(0, 6);
        await expect(productTableLines.length).to.be.equal(6);
        //comparison item by item
        await products.forEach(function(product) {
            expect(productTableLines.indexOf(product), 'Element '+product+' to be in list').to.be.not.equal(-1);
        });
    });

    //Fourth test: go to FO, navigate to the first product and add it to the cart, check modal is opened
    it ('should go to the FO, select first product and add it to cart', async function() {
        await page.goto(URL_FO);
        await page.click('article:nth-child(1) a.thumbnail');
        await page.click('.btn.add-to-cart');
        await expect(await isElementVisible(page, '#blockcart-modal', 2000)).to.be.true;
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
