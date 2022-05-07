;/**
 * This File contains wrapper functions for PlayWright and Puppeteer API
 */
 const config = require('../configuration/config');
 const waits = require('../configuration/waits');
 const fetch = require('node-fetch');
 module.exports = {
     /**
     * Click on Any Element
     * 
     * @param  {DOM} page - page or a frame in which your selector exist which you want to click
     * @param  {string} selector - A selector which you want to click
     * @param  {Object} options - If you pass options Argument it override all existing options.
     * @param  {string} errorMessage - the mouse button which you want to triger, default button is left
     * @return {void} Nothing
     */
     click: async function (page, selector, options ,errorMessage='',screenShot={disabled:false}) {
         try {
             if (selector.startsWith('/') || (selector.startsWith('(/'))) {//Handle XPath
                 await module.exports.click_xPath(page, selector)
             }
             else {
                 await page.waitForSelector(selector, { timeout: config.waitingTimeout })
                 await page.focus(selector)
                 if (options) {//Check the truthy of Options Object
                     await page.click(selector, options)
                 }
                 else {
                     await page.click(selector)
                 }
             }
         } catch (error) {
             throw new Error(`${errorMessage} | Could not click on selector: ${selector}  Detail Error:` + error)
         }
     },

 
     /**
     * Click on Any Element With Single Promise Navigation
     * 
     * @param  {DOM} page - page or a frame in which your selector exist which you want to click
     * @param  {string} selector - A selector which you want to click
     * @param  {string} button - the mouse button which you want to triger, default button is left 
     * @return {void} Nothing
     */
     clickWithNavigate: async function (page, selector, button) {
         try {
             await Promise.all([
                 module.exports.click(page, selector, button),
                 page.waitForNavigation({ waitUntil: waits.networks.NETWORK_IDEAL_0/*,timeout:0*/ })
             ])
         } catch (error) {
             if (error.code === 'PPTR_TIMEOUT') {
                 log4js.warn('Error While Navigating(Timeout): ' + error)
                 console.log('Error While Navigating(Timeout): ' + error)
             }
             else {
                 console.log('Error While Navigating: ' + error)
             }
         } finally {
             await module.exports.takeScreenShot(page)
         }
     },
     /**
     * Type a text on Any input type Element
     * 
     * @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
     * @param  {string} text - sequences of characters which you want to type
     * @param  {string} selector - A selector in which you want to type
     * @param  {number} myDelay - delay in typing the text on given selector, default delay is 80 milisecond
     * @param  {boolean} eventDispatch - If typing is not work properly you can set this flag as true and then try
     */
     typeText: async function (page, text, selector, myDelay, eventDispatch = false) {
         try {
             if (myDelay == undefined) {
                 myDelay = 80
             }
             if (eventDispatch && !selector.startsWith('//')) {
                 await page.waitForSelector(selector, { timeout: config.waitingTimeout }),
                     await page.evaluate((selector, text) => {
                         const inputElement = document.querySelector(selector);
                         const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                         nativeInputValueSetter.call(inputElement, text);
                         const ev2 = new Event('input', { bubbles: true });
                         inputElement.dispatchEvent(ev2);
                     }, selector, text); 
             }
             else {
                 if (selector.startsWith('//') || (selector.startsWith('(//'))) {//Handle XPath
                     await module.exports.typeTextXPath(page, text, selector)
                 }
                 else {
                     await page.waitForSelector(selector, { timeout: config.waitingTimeout }),
                         await Promise.all([
                             page.focus(selector),
                             page.click(selector, { clickCount: 3 }),
                         ]).catch(function (error) {
                             throw new Error(`Could not type text into selector: ${selector} -> ${error}`)
                         });
                     await page.type(selector, text, { delay: myDelay })
                 }
             }
         } catch (error) {
             throw new Error(`Could not type text into selector: ${selector} -> ${error}`)
         }
     },

     /**
     * Type a text on Any input type Element
     * 
     * @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
     * @param  {string} text - sequences of characters which you want to type
     * @param  {string} selector - A XPath selector in which you want to type
     */
     typeTextXPath: async function (page, text, selector) {//TODO remove all typeTextXpath explicitly calls 
         try {
             await page.waitForXPath(selector)
             let inputField = await page.$x(selector)
             await inputField[0].focus(inputField)
             await inputField[0].click({ clickCount: 3 })
             await inputField[0].type(text)
         } catch (error) {
             log4js.error(`Could not type text into xPath selector: ${selector} -> ${error}`)
             throw new Error(`Could not type text into xPath selector: ${selector} -> ${error}`)
         } finally {
             await module.exports.takeScreenShot(page)
         }
     },
     /**
      * Load A Given URL
      * @param {*} page 
      * @param {*} url 
      */
     loadUrl: async function (page, url) {
         await page.goto(url, { waitUntil: waits.networks.NETWORK_IDEAL_0 })
     },
     /**
     * Get a text from DOM Element
     * 
     * @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
     * @param  {string} selector - A selector whose inside HTML text you want to retrieve
     * @return {string} inside text of an given HTML element
     */
     getText: async function (page, selector, textOnly) {
         try {
             await page.waitForSelector(selector, { timeout: config.waitingTimeout })
             if (textOnly) {
 
                 return page.$eval(selector, e => e.innerText)
             }
             return page.$eval(selector, e => e.innerHTML)
         } catch (error) {
             throw new Error(`Cannot get text from selector: ${selector}`)
         }
     },
     /**
  * Get a text from DOM Element
  * 
  * @param  {DOM} page - page or a frame in which your selector exist and you want to type text in that
  * @param  {string} selector - xPath of element whose value is required
  * @param  {string} errorMessage - Error Message to send if error is thrown
  */
     getValue: async function (page, selector,errorMessage='') {
     try {
         await page.waitForSelector(selector, { timeout: config.waitingTimeout }) 
         return await page.$eval(selector, selectedValue=> selectedValue.value)
     } catch (error) {
         log4js.error(`Cannot get value from xPath: ${selector}`)
         throw new Error(`${errorMessage} |Cannot get value from xPath: ${selector}`)
     }
     },

     /**
      * 
      * @param {String} URL - The URL of the API
      * @returns - The response of the api call.
      */

    httpGet:async function(URL)
    {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }
        const result = await response.text();
        const json = JSON.parse(result);
        return result;
    },
     /**
     * Get a Value of Provided Attribute from DOM Element
     * 
     * @param  {DOM} page - page or a frame in which your selector exist
     * @param  {string} selector - A selector whose inside attribute inner content you want to retrieve
     * @param  {string} attributeName - A name of Attribute whose value you want to retrieve, default attribute name is value
     * @return {string} provided attribute value is returned
     */
     getAttributeValue: async function (page, selector, attributeName="value",errorMessage="") {
         try {
             let object=null
             if (selector.startsWith('/') || (selector.startsWith('(/'))) { //Mean XPATH
                 await page.waitForXPath(selector)
                 object = await page.$x(selector)
             }else{
                 await module.exports.waitForSelector(page,selector)
                 object = await page.$$(selector)
             }
             let attributeValue = await page.evaluate((el, attributeName) => el.getAttribute(attributeName), object[0], attributeName);
             return attributeValue
         } catch (error) {
             log4js.error(`${errorMessage} | Cannot get Attribute ${attributeName} Value from selector: ${selector}`)
             throw new Error(`${errorMessage} | Cannot get Attribute ${attributeName} Value from selector: ${selector}`)
         }
     },
     /**
     * Click on Any XPATH Element
     * 
     * @param  {DOM} page - page or a frame in which your selector exist which you want to click
     * @param  {string} selector - A XPATH selector which you want to click
     */
     click_xPath: async function (page, selector) {//TODO remove all click_xPath explicitly calls 
         try {
             if (config.RUN_BY.LIBRARY) {
                 await page.waitForXPath(selector, { timeout: config.waitingTimeout });
                 const [button] = await page.$x(selector);
                 await Promise.all([
                     button.click(),
                 ]);
             }
             else {
                 await module.exports.click(page, selector)
             }
 
         } catch (error) {
             throw new Error(`Could not click on the XPath: ${selector} ` + error);
         } 
     },
     /**
     * Get Number of count of given Element
     * 
     * @param  {DOM} page - page or a frame in which your selector exist which you want to click
     * @param  {string} selector - A selector which you want to count
     * @return {number} total given HTML element at given page or frame
     */
     getCount: async function (page, selector) {
         try {
             await page.waitForSelector(selector)
             return page.$$eval(selector, items => items.length)
         } catch (error) {
             throw new Error(`Cannot get count of selector: ${selector}`)
         }
     },
     /**
      * Get Number of count of given Element
      * 
      * @param  {DOM} page - page or a frame in which your selector exist which you want to click
      * @param  {string} selector - A selector which you want to count
      * @return {number} total given HTML element at given page or frame
      */
     getCount_xPath: async function (page, selector) {
         try {
             await page.waitForXPath(selector)
             return page.$x(selector, items => items.length)
         } catch (error) {
             throw new Error(`Cannot get count of XPath: ${selector}`)
         }
     },
     /**
  * Press Any key from Keyboard to Page or frame and release key
  * 
  * @param  {DOM} page - page or a frame in which your selector exist which you want to click
  * @param  {string} key - A key which u want to press like (1 or 2 or Tab etc)
  * @return {Void} Nothing
  */
     pressKey: async function (page, key) {
         try {
             await page.keyboard.press(key)
         } catch (error) {
             log4js.error(`Could not press key: ${key} on the keyboard`)
             throw new Error(`Could not press key: ${key} on the keyboard`)
         }
     },
     /**
     * Press and Hold Any key from Keyboard to Page or frame
     * 
     * @param  {DOM} page - page or a frame in which your selector exist which you want to click
     * @param  {string} key - A key which u want to press and Hold like (Enter or Shift or Ctrl etc)
     * @return {Void} Nothing
     */
     downKey: async function (page, key) {
         try {
             await page.keyboard.down(key)
         } catch (error) {
             log4js.error(`Could not press key: ${key} on the keyboard`)
             throw new Error(`Could not press key: ${key} on the keyboard`)
         }
     },
     /**
     * Release Key Pressed by Keyboard on Page or frame
     * 
     * @param  {DOM} page - page or a frame in which your selector exist which you want to click
     * @param  {string} key - A key which u want to release like (Enter or Shift or Ctrl etc)
     * @return {Void} Nothing
     */
     upKey: async function (page, key) {
         try {
             await page.keyboard.up(key)
         } catch (error) {
             throw new Error(`Could not press key: ${key} on the keyboard`)
         }
     },
     /**
      * 
      * @param {DOM} page - Broswer Pge where your slector exist 
      * @param {string} selector- Selector value which you want to hover
      * @param {number} index- element No. which you want to hover, default value is 0 point to first element
      */
     hover: async function (page, selector, index = 0) {
         try {
             if (selector.startsWith('//')) {
                 await page.waitForXPath(selector)
                 let element = await page.$x(selector)
                 await element[index].focus(element)
                 await element[index].hover()
             }
             else {
                 await page.waitForSelector(selector)
                 await page.hover(selector)
             }
         } catch (error) {
             log4js.error(`Could not Hover on Selector ${selector}-> ${error}`)
             throw new Error(`Could not Hover on Selector ${selector}-> ${error}`)
         }
     },
     /**
    * 
    * @param {DOM} page - Broswer Pge where your slector exist 
    * @param {string} selector- Selector value which you want to hover
    */
     hoverXPath: async function (page, selector, timeOut) {
         try {
             if (config.RUN_BY.LIBRARY) {
                 await page.waitForXPath(selector)
                 await page.hover(selector)
             }
             else {
                 await page.waitForSelector(selector)
                 await page.hover(selector)
             }
 
         } catch (error) {
             log4js.error(`Could not Hover on Selector ${selector}-> ${error}`)
             throw new Error(`Could not Hover on Selector ${selector}-> ${error}`)
         }
     },
     /**
     * Make sure given element exist on a page or frame if not it throw error
     * 
     * @param  {DOM} page - page or a frame in which you check your selector exist
     * @param  {string} selector - A selector which u want to verify it exist on page or frame
     * @return {boolean} true
     */
     shouldExist: async function (page, selector, timeOut=config.waitingTimeout,errorMessage="") {
         try {
             if(!Array.isArray(selector)){
                 selector=selector.split()
             }
             if (config.RUN_BY.LIBRARY) {
                 for (let index = 0; index < selector.length; index++) {
                     await page.waitForSelector(selector[index], { timeout: timeOut })
                 }
                 
             } else {
                 await page.waitForSelector(selector, { waitFor: "visible", timeout: timeOut })
             }
             return true
         } catch (error) {
             throw new Error(`${errorMessage} | Unable to find following selector ${selector} ${error}`)
         }
     },
     /**
     * Make sure given XPATH element exist on a page or frame if not it throw error
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selector - A XPATH selector which u want to verify it exist on page or frame
     * @param  {number} timeOut - timeOut Value to wait maximum for given selector
     * @return {Void} Nothing
     */
     shouldExistXPath: async function (page, selector, timeOut,errorMessage=``) {
         try {
             if(!Array.isArray(selector)){
                 selector=selector.split()
             }
             if (config.RUN_BY.LIBRARY) {
                 for (let index = 0; index < selector.length; index++) {
                     await page.waitForXPath(selector[index], { timeout: timeOut })
                 }
                 
             } else {
                 await page.waitForXPath(selector, { waitFor: "visible", timeout: timeOut })
             }
             return true
         } catch (error) {
             throw new Error(`${errorMessage} |Xpath Selector: ${selector} not exist withing given timeout ${timeOut}`)
         } 
     },
     /**
     * Make sure given element can't exist on a page or frame if exist return true
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selector - A  selector which u want to verify it not exist on page or frame
     * @param  {number} timeOut - timeOut Value to wait maximum for given selector
     * @return {boolean} false
     */
     shouldNotExist: async function (page, selector, timeOut, options) {
         let myError = `Element ${selector} is Visible`
         try {
             if (timeOut == null) {
                 await page.waitForSelector(selector)
             }
             else {
                 await page.waitForSelector(selector, { timeout: timeOut, visible: true })
             }
             throw (myError)
         } catch (error) {
             if (error === myError) {
                 throw new Error(error)
             }
             else {
                 return true
             }
         } 
     },
     /**
    * Make sure given element can't exist on a page or frame if exist return true
    * 
    * @param  {DOM} page - page or a frame where selector u want to findt
    * @param  {string} selector - A  selector which u want to verify it not exist on page or frame
    * @param  {number} timeOut - timeOut Value to wait maximum for given selector
    * @return {boolean} false
    */
     shouldNotExistXPath: async function (page, selector, timeOut, options) {
         let myError = `Element ${selector} is Visible`
         try {
             if (timeOut == null) {
                 await page.waitForXPath(selector)
             }
             else {
                 await page.waitForXPath(selector, { timeout: timeOut, visible: true })
             }
             throw (myError)
         } catch (error) {
             if (error === myError) {
                 log4js.error(error)
                 throw new Error(error)
             }
             else {
                 return true
             }
         } finally {
             await module.exports.takeScreenShot(page)
         }
     },
     /**
     * Double click on given elemnnt reside on given page or frame
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selector - A  selector on which u want to double click
     * @return {Void} Nothing
     */
     doubleClick: async function (page, selector) {
         try {
             await page.waitForSelector(selector, { timeout: config.waitingTimeout })
             if (config.RUN_BY.LIBRARY) {
                 await page.evaluate(selector => {
                     var targLink = document.querySelector(selector);
                     var clickEvent = document.createEvent('MouseEvents');
                     clickEvent.initEvent('dblclick', true, true);
                     targLink.dispatchEvent(clickEvent);
                 }, selector)
             }
             else {
                 await page.dblclick(selector)
             }
         } catch (error) {
             log4js.error(`Unable to double click on Selector: ${selector}`)
             throw new Error(`Unable to double click on Selector: ${selector}`)
         } finally {
             await module.exports.takeScreenShot(page)
         }
     },
     /**
     * Double click on given elemnnt reside on given page or frame
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selector - A  selector on which u want to double click
     * @param  {int} index - Element index to be double clicked
     * @return {Void} Nothing
     */
     doubleClickXPath: async function (page, selector, index = 0) {
         try {
             await page.waitForXPath(selector, { timeout: config.waitingTimeout })
             let elementToDoubleClick = await page.$x(selector)
             await elementToDoubleClick[index].click()
             await elementToDoubleClick[index].click({ clickCount: 2 })
 
         } catch (error) {
             log4js.error(`Unable to double click on XPath Selector: ${selector}`)
             throw new Error(`Unable to double click on XPath Selector: ${selector}`)
         } finally {
             await module.exports.takeScreenShot(page)
         }
     },
     /**
     * Check Element is exist on page or not
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selector - A  selector which u want to verify it exist or not on page or frame 
     * @param  {number} timeOut - timeOut Value to wait maximum for given selector
     * @return {boolean} true
     */
     isExist: async function (page, selector, timeOut) {
         try {
             if (config.RUN_BY.LIBRARY) {
                 if (selector.startsWith('//')) {//Handle XPath
                     await page.waitForXPath(selector, { timeout: timeOut })
                 } else {
                     await page.waitForSelector(selector, { timeout: timeOut })
                 }
             } else {
                 await page.waitForSelector(selector, { waitFor: "visible", timeout: timeOut })
             }
             return true;
         } catch (error) {
             return false;
         }
     },
     /**
     * Set attribute on Element
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selector - A  selector which u want toadd attributes
     * @param  {string} attributeName - A  attribute name which u want to add
     * @param  {string} attributeValue - A attributeValue which u want to add in given new attribute
     * @return {Void} Nothing
     */
     setAttribute: async function (page, selector, attributeName, attributeValue) {
         try {
             await page.waitForSelector(selector)
             await page.evaluate(() => document.querySelector(selector).setAttribute(attributeName, attributeValue));
         } catch (error) {
             throw new Error(error)
         }
 
     },
     /**
     * Wanit Until Specif Element Invisible or gone from a page or frame
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selector - A  selector whose u want to wait for disappear
     * @param  {number} maximumTime - maximum time which u want to wait the element
     * @param  {string} faliureSelector - A selector, if it appear during waiting it means its faliure
     * @return {Void} Nothing
     */
     waitUntilElementInvisible: async function (page, selector, maximumTime, faliureSelector) {
         let flag = false;
         try {
             var startTime = Date.now();
             do {
                 let exist = await module.exports.isExist(page, selector, 1000)
                 if (!exist) {
                     flag = true;
                     break;
                 }
                 if ((Date.now() - startTime) > maximumTime) {
                     break;
                 }
                 if (faliureSelector != undefined) {
                     let existFaliure = await module.exports.isExist(page, faliureSelector, 1000)
                     if (existFaliure) {
                         break;
                     }
                 }
                 await delay(1000)
             } while (true);
         } catch (error) {
             log4js.error(`Unable to get invisible state of ${selector} within time ${maximumTime} -> ${error}`)
             throw new Error(`Unable to get invisible state of ${selector} within time ${maximumTime} -> ${error}`)
         }
         if (!flag) {
             throw new Error(`Selector ${selector} still exist within given time ${maximumTime}`)
         }
 
     },
     /**
     * Wait for Element by XPATH
     * 
     * @param  {DOM} page - page or a frame where selector u want to wait
     * @param  {string} selector - A XPATH selector which u want wait for visible
     * @return {Void} Nothing
     */
     waitForXPath: async function (page, selector, timeout = config.waitingTimeout) {
         try {
             if (config.RUN_BY.LIBRARY) {
                 await page.waitForXPath(selector, { timeout: timeout })
             }
             else {
                 await page.waitForSelector(selector)
             }
         } catch (error) {
             throw new Error(error)
         }
     },
      /**
     * Wait for Element by its Query Selector
     * 
     * @param  {DOM} page - page or a frame where selector u want to wait
     * @param  {string} selector - A Query selector which u want wait for visible
     * @return {Void} Nothing
     */
    waitForSelector: async function (page, selector, timeout = config.waitingTimeout) {
     try {
         await page.waitForSelector(selector,{ timeout: timeout})
     } catch (error) {
         log4js.error(error)
         throw new Error(error)
     }
 },
     /**
     * Select Value From DropDown menue
     * 
     * @param  {DOM} page - page or a frame where selector u want to findt
     * @param  {string} selectSelector - A dropdown select element
     * @param  {string} optionValue - an option value to select from options
     * @return {Void} Nothing
     */
     selectValueFromDropDown: async (page, selectSelector, optionValue) => {
         try {
             await page.waitForSelector(selectSelector)
             if (config.RUN_BY.LIBRARY) {
                 await page.select(selectSelector, optionValue)
             }
             else {
                 await page.selectOption(selectSelector, optionValue)
             }
         } catch (error) {
             throw new Error(error)
         } finally {
             await module.exports.takeScreenShot(page)
         }
     },
     /**
     * Take screen shot of a Page
     * 
     * @param  {DOM} page - page or a frame whose screen shot u want to taken. 
     * For Frame it only Print error because frame class can't have screenshot function.
     * It save screenshots in tempScreenShots folder with timestamp. After each Test case end all these screens hots are converted to GIF and Delete images
     * @return {Void} Nothing
     */
     takeScreenShot: async function (page) {
         try {
             await page.screenshot({ path: `${config.TEMP_FILES_DIRECTORY}${Number(new Date())}.png` });
         } catch (error) {
            //  log4js.warn('Error While Taking ScreenShot: ' + error)
             console.log('Error While Taking ScreenShot: ' + error)
         }
     },
     /**
     *  Close All the Broser Pages except One
      */
     closeAllPagesExcept1: async function () {
         try {
             let pages = null;
             await browser.pages().then(async mPage => {
                 pages = mPage;
                 for (let index = 1; index < pages.length; index++) {
                     await pages[index].close()
                 }
             })
         } catch (error) {
             throw new Error(error)
         }
     },
     /**
      * Function that creates a Page(Open a Tab) in a launched browser
      * {browser} it takes launch browser as a parameter and return its new page
      */
     createPage: async function (browser) {
         let page
         try {
             page = await browser.newPage();
             await page.setDefaultNavigationTimeout(config.navigationTimeOut);
             await page.setDefaultTimeout(config.navigationTimeOut);
            //  await page.goto(config.baseURL);
             return page
         } catch (error) {
             throw new Error(error)
         }
     },
     /**
     *
     * @param {Login Page where username and password field exist} page
     * @param  {string} selector - A XPATH selector which u want wait for visible
     */
 
     /**
      * 
      * @param {Login Page where username and password field exist} page
      * @param {string} selector - A XPATH selector which u want wait for visible
      * @param {integer} addToX - add some value to coordinate X to move mouse inside  
      * @param {integer} addToY - add some value to coordinate Y to move mouse inside  
      */
     moveMouse: async function (page, selector, addToX, addToY) {
         try {
             await page.waitForSelector(selector)
             const selectedObject = await page.$(selector)
             const coordinates = await selectedObject.boundingBox();
             await page.mouse.move(coordinates.x + addToX, coordinates.y + addToY);
 
         } catch (error) {
             try {
                 await page.emit('error', new Error(error))
             } catch (error) {
                 throw new Error(`Unable to Login To Tango` + error)
             }
         }
     },
     /**
      * To get coordinates/BoundingBox of any locator inside the Page or Frame
      * @param  {DOM} page - page or a frame in which your selector exist which you want to get coordinates of 
      * @param  {string} selector - Object selector of which you want to get the coordinates
      */
     getCoordinates: async function (page, selector) {
         try {
             let coordinates
             if (selector.startsWith('//') || (selector.startsWith('(//'))) {
                 await module.exports.waitForXPath(selector)
                 //TODO Handle Xpath BoundingBox
             }  
             else{
                 await module.exports.waitForSelector(page,selector)
                 const myobject = await page.$(selector)
                 coordinates = await myobject.boundingBox()
             }
             return coordinates
         }
         catch (error) {
             throw new Error(error)
         }
     },
 
 }