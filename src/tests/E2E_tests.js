/**
 * Author       : Sammar Ahmad 
 * Date         : DD/MM/YYYY
 * Description  : API + E2E Tests
 */
 const myHelper = require('../lib/commonFunctions')
 const objects = require('../pageObjects/page')
 const config = require('../configuration/config')
 const tm = require('../test-setup');
const { sleep } = require('wd/lib/commands');
 require('mocha-allure-reporter');
 require('mochawesome')
 describe('API + End to End Tests', async () => {
     let page
     let adName = "This is an AD "+Math.floor(Math.random() * 50000)
     let street = "36A "+Math.floor(Math.random() * 5000)
     let rooms = "3"+Math.floor(Math.random() * 99)
     let price = "2"+Math.floor(Math.random() * 99)
     before(async function () {
         page = await myHelper.createPage(browser)          //create the browser instance 
         try {
         } catch (error) {
             await page.emit('error', new Error('Unable to the browser within given time ' + error))
         }
     })
     after(async function () {
         try { 
             await page.close()             //After all the tests close the browser
         }
         catch (error) {
             console.log('Error While Page Close:->' + error)
         }
     })
    
    /**
     * In this test, first the advertisement will created from the UI side.
     * Then all the entries will be verified from the UI(Home Page)
     * Finally the same advertisment will be verified from the Backend(API Call) to check correct data is stored/created. 
     */
    it('Verify that a new created advertisement should be displayed on the home page', async () => {
        try {
           console.log("Ad Name:"+adName)
           console.log("Street:"+street)
           console.log("rooms:"+rooms)
           console.log("Price:"+price)
           await page.goto(config.baseURL)                                          //Open the advertisement Site
           await myHelper.click_xPath(page, objects.HOME_PAGE.CREATE_AD_BUTTON_XPATH)           //Click the plus button
        
            //Enter all the fields of the form
           await myHelper.typeText(page, adName, objects.FORM_PAGE.ADVERTISEMENT_FIELD)
           await myHelper.typeText(page, street, objects.FORM_PAGE.STREET_FIELD)
           await myHelper.typeText(page, rooms, objects.FORM_PAGE.ROOM_FIELD)
           await myHelper.typeText(page, price, objects.FORM_PAGE.PRICE_FIELD)
           await myHelper.click(page, objects.FORM_PAGE.STATUS_CHECKBOX)

           await myHelper.click_xPath(page, objects.FORM_PAGE.SAVE_BUTTON_XPATH)         //submit by clicking the save button

            //All data related to created Ad is being verified
           await myHelper.shouldExistXPath(page,`//td[contains(text(),"${adName}")]`,5000)
           await myHelper.shouldExistXPath(page,`//td[contains(text(),"${street}")]`,5000)
           await myHelper.shouldExistXPath(page,`//td[contains(text(),"${rooms}")]`,5000)
           await myHelper.shouldExistXPath(page,`//td[contains(text(),"${price}")]`,5000)

           let result =await myHelper.httpGet(config.API_baseURL)               //Api Get Request 
           console.log("Result"+result)                                         //Printing the data for debugging purpose

           //Filtering the requested json object with required data
           var jsonObject = await JSON.parse(result).filter(function (entry) {
                return entry.name === adName;
            });

            //Asserting/Expecting the test data
            expect(String(jsonObject[0].name)).to.equal(adName);
            expect(String(jsonObject[0].street)).to.equal(street);
            expect(String(jsonObject[0].rooms)).to.equal(rooms);
            expect(String(jsonObject[0].price)).to.equal(price);
            expect(jsonObject[0].status).to.equal(true);
            
        } catch (error) {
            await page.emit('error', new Error(error))
            console.log(error)
        }
    })

    /**
     * This test case will be editing existing advertisment and will be updating only AD Name, Rooms and Price.
     * After updating, data will be verified from frontend as well as backend with the api call.
     */
    it('Verify that user should be able to edit any exisiting advertisement, and on the home page it should be updated', async () => {
        try {

            //generating new test data for updating
            let newADName = "New Add"+Math.floor(Math.random() * 50000)
            let newRooms = "60"+Math.floor(Math.random() * 99)
            let newPrice = "1"+Math.floor(Math.random() * 99)
            //printing for debugging
            console.log("New Ad Name:"+newADName)
            console.log("New Street:"+newRooms)
            console.log("New Price:"+newPrice)
            await page.goto(config.baseURL)             //Open the advertisement Site
            //Open exisiting AD
            await myHelper.click_xPath(page, `//td[contains(text(),"${adName}")]`)
            //Updating 3 fields as mentioned in start 
            await myHelper.typeText(page, newADName, objects.FORM_PAGE.ADVERTISEMENT_FIELD)
            await myHelper.typeText(page, newRooms, objects.FORM_PAGE.ROOM_FIELD)
            await myHelper.typeText(page, newPrice, objects.FORM_PAGE.PRICE_FIELD)
            //Clicking Save Button
            await myHelper.click_xPath(page, objects.FORM_PAGE.SAVE_BUTTON_XPATH)
            //Verifying the updated record from the front end along with the non updated record.
            await myHelper.shouldExistXPath(page,`//td[contains(text(),"${newADName}")]`,5000)
            await myHelper.shouldExistXPath(page,`//td[contains(text(),"${street}")]`,5000)
            await myHelper.shouldExistXPath(page,`//td[contains(text(),"${newRooms}")]`,5000)
            await myHelper.shouldExistXPath(page,`//td[contains(text(),"${newPrice}")]`,5000)

            let result =await myHelper.httpGet(config.API_baseURL)               //Api Get Request 
            console.log("Result"+result)                                            //Printing the data for debugging purpose

            //Filtering the requested json object with required data
            var jsonObject = await JSON.parse(result).filter(function (entry) {
                return entry.name === newADName;
            });

            //Asserting/Expecting the test data
            expect(String(jsonObject[0].name)).to.equal(newADName);
            expect(String(jsonObject[0].street)).to.equal(street);
            expect(String(jsonObject[0].rooms)).to.equal(newRooms);
            expect(String(jsonObject[0].price)).to.equal(newPrice);
            expect(jsonObject[0].status).to.equal(true);
        } catch (error) {
            await page.emit('error', new Error(error))
            console.log(error)
        }
    })




    
 
 })//end of Application

