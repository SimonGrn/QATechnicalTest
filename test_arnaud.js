//node node_modules/mocha/bin/mocha tests/test.js --timeout 0

// on declare la librairie de Node Pupeeteer
const puppeteer = require('puppeteer');
// Chai : librairie d'assertion
const { expect } = require('chai');
// on declare le navigateur
let browser;
// on declare la page
let page;

//On créé un groupe de test que l’on nomme test for PrestaShop
// j'avais vu qu'on écrivais comme cela : describe('test for PrestaShop', () => {
describe('test for PrestaShop', async function() {
    //premier test
    it('first test', async function() {
        //parametres du navigateur
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
        //il manque un const avant page
        page = await browser.newPage();
        //on accede à l'url
        await page.goto('http://localhost/prestashop/admin-dev');
        //on tape l'email 
        await page.type('#email', 'demo@prestashop.com');
        // on tape le mot de passe
        await page.type('#passwd', 'prestashop_demo');
        //on clique sur le bouton
        await page.click('#submit_login');
        //eviter le wait et prendre plutot un id
        await page.waitFor(5000);
        //on inspecte dans la console le titre de la page
        // je mettrai des espaces entre le +
        // je ne comprend pas le await 
        await console.log('Check page title is correct : '+page.title());
        //quel est le type d'element 
        await page.click('button.onboarding-button-shut-down');
        //on clique sur la class ...
        await page.click('#subtab-AdminCatalog');
         //on clique sur la class ...
        await page.click('#subtab-AdminProducts');
        //eviter le wait et prendre plutot un id
        await page.waitFor(5000);
        // je ne comprend pas le $$ on attend que l'id s'affiche et on evalue la taille ou nombre de lignes
        const nbrLines = (await page.$$('#product_catalog_list table tbody tr')).size();
       //on inspecte le nombre de lignes
        console.log(nbrLines+' should be equal to 20');
        // on declare 6 variables : on recupere l'id dans l'inspection du navigateur
        const product1 = await page.$eval('#product_catalog_list > div:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(4) > a', e => e.innerText);
        const product2 = await page.$eval('#product_catalog_list > div:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > a', e => e.innerText);
        const product3 = await page.$eval('#product_catalog_list > div:nth-child(2) > div > div > table > tbody > tr:nth-child(3) > td:nth-child(4) > a', e => e.innerText);
        const product4 = await page.$eval('#product_catalog_list > div:nth-child(2) > div > div > table > tbody > tr:nth-child(4) > td:nth-child(4) > a', e => e.innerText);
        const product5 = await page.$eval('#product_catalog_list > div:nth-child(2) > div > div > table > tbody > tr:nth-child(5) > td:nth-child(4) > a', e => e.innerText);
        const product6 = await page.$eval('#product_catalog_list > div:nth-child(2) > div > div > table > tbody > tr:nth-child(6) > td:nth-child(4) > a', e => e.innerText);
        // on affiche dans la console le resultat de chaque variable qui a été définie precedemment
        // je mettrai des espaces entre le +
        console.log('product 1 name is Customizable mug : '+product1);
        console.log('product 2 name is Hummingbird notebook : '+product2);
        console.log('product 3 name is Brown bear notebook : '+product3);
        console.log('product 4 name is Mountain fox notebook : '+product4);
        console.log('product 5 name is Pack Mug + Framed poster : '+product5);
        console.log('product 6 name is Hummingbird - Vector graphics : '+product6);
        // on attend la fermeture du navigateur
        await browser.close();
    });
    // second test
    it('second test', async function() {
            //parametres du navigateur
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
        //il manque un const avant page
        page = await browser.newPage();
        // on accede à une url 
        await page.goto('http://localhost/prestashop/');
        // on clique sur un bouton (id)
        await page.click('#content > section > div > article:nth-child(1) > div > a');
        // il faudrait éviter le wait et remplacer par un selecteur id 
        await page.waitFor(5000);
        //on clique sur un element (id)
        await page.click('#add-to-cart-or-refresh > div.product-add-to-cart > div > div.add > button');
        // il faudrait éviter le wait et remplacer par un selecteur id 
        await page.waitFor(5000);
        //on definit une variable  qui permet de definir une modale
        const modal = await page.waitFor('#blockcart-modal[style="display: block;"]');
        // je ne comprend pas l'await avant le console.log
        await console.log('modal is visible if this is equal to true : ' + modal);
        // wait pas indispensable
        await page.waitFor(500);
        // on ferme le navigateur
        await browser.close();
    });
});