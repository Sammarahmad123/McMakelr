/**
 * Author       : Sammar Ahmad 
 * Date         : DD/MM/YYYY
 * Description  : Basic Tests
 */
 const myHelper = require('../lib/commonFunctions')
 const objects = require('../pageObjects/page')
 const config = require('../configuration/config')
 const tm = require('../test-setup');
const { sleep } = require('wd/lib/commands');
 require('mocha-allure-reporter');
 require('mochawesome')
 describe('Basic Tests Advertisement', async () => {
     let page
     before(async function () {
         page = await myHelper.createPage(browser)
         try {
         } catch (error) {
             await page.emit('error', new Error('Unable to the browser within given time ' + error))
         }
     })
     after(async function () {
         try {
             await page.close()
         }
         catch (error) {
             console.log('Error WHile Page Close:->' + error)
         }
     })
     
     /**
      *  This test case will just check that the given url is loaded completely.
      */
     it('Verify that Advertisment Web Page is loaded successfully', async () => {
        try {
           await page.goto(config.baseURL);
           await myHelper.shouldExistXPath(page, objects.HOME_PAGE.CREATE_AD_BUTTON_XPATH,5000)
        } catch (error) {
            await page.emit('error', new Error(error))
            console.log(error)

        }
    })

    /**
     * This test case will verify that On clicking the plus button, user next sees the AD form page. 
     */
     it('Verify that on Clicking plus button, user should be landed to the advertisement form page', async () => {
         try {
            await page.goto(config.baseURL)
            await myHelper.click_xPath(page, objects.HOME_PAGE.CREATE_AD_BUTTON_XPATH)
            await myHelper.shouldExist(page, objects.FORM_PAGE.ADVERTISEMENT_FIELD)
         } catch (error) {
             await page.emit('error', new Error(error))
             console.log(error)

         }
     })

     /**
      * This is negative test case checking the save button should not be enabled without fulfilling all required fields
      */
     it('Verify that on save button should not be enabled without entering date to all the fields', async () => {
        try {
           await page.goto(config.baseURL)
           await myHelper.click_xPath(page, objects.HOME_PAGE.CREATE_AD_BUTTON_XPATH)
           await myHelper.shouldExist(page, objects.FORM_PAGE.DISABLE_SAVE_BUTTON)
        } catch (error) {
            await page.emit('error', new Error(error))
            console.log(error)

        }
    })

    /**
     * This test case will verify that save button is enabled when all requirements of the form are completed.
     */
    it('Verify that save button should be enabled when all required fields data is entered', async () => {
        try {
           await page.goto(config.baseURL)
           await myHelper.click_xPath(page, objects.HOME_PAGE.CREATE_AD_BUTTON_XPATH)
           await myHelper.typeText(page,"Ad Name", objects.FORM_PAGE.ADVERTISEMENT_FIELD)
           await myHelper.typeText(page,"375", objects.FORM_PAGE.PRICE_FIELD)
           await myHelper.shouldNotExist(page, objects.FORM_PAGE.DISABLE_SAVE_BUTTON,5000)
        } catch (error) {
            await page.emit('error', new Error(error))
            console.log(error)
        }
    })

    /**
     * This test case checks that price field should not be accepting a non integer value. In case users enter, an error message should be shown. 
     */
    it('Verify that price field should not accept other than number, it should show an error message when a non integer is entered', async () => {
        try {
           await page.goto(config.baseURL)
           await myHelper.click_xPath(page, objects.HOME_PAGE.CREATE_AD_BUTTON_XPATH)
           await myHelper.typeText(page,"Ad Name", objects.FORM_PAGE.ADVERTISEMENT_FIELD)
           await myHelper.typeText(page,"abc", objects.FORM_PAGE.PRICE_FIELD)
           await myHelper.click(page,objects.FORM_PAGE.PRICE_FIELD)
           await myHelper.waitForXPath(page, objects.FORM_PAGE.INVALID_PRICE_ERROR_MSG_XPATH)
           await myHelper.shouldExistXPath(page, objects.FORM_PAGE.INVALID_PRICE_ERROR_MSG_XPATH,5000)
        } catch (error) {
            await page.emit('error', new Error(error))
            console.log(error)
        }
    })

 
 })

