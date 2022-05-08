### This Test Project is developed using the following technologies.
- Puppeteer (Javascript Based Web Automation Testing Tool)
- Mocha (JavaScript testing framework that also supports Node. js)


## Tests Structure
Under 'src\tests' there are two test files, 
- basic_tests.js -> Covering all the basic or can say unit tests to cover small functionalities of the advertisement site.
- E2E_tests.js -> Covering End to End tests that start from creating Ads and then verifying from UI and Backend(API).

## Running the Project
Clone the Repository and Run 

`npm install`

This will install all the node modules required for this project. 

Then run

  `npm run all_tests` 

This will two files i.e 'basic_tests.js' & 'E2E_tests.js'.

If you want to run only basic_tests.js run the following command

  `npm run basic_test`

If you want to run only E2E_tests.js run the following command

  `npm run E2E_test`
  

## Project Structure
  - src\configuration\config.js -> contains all the configuration(URL, API_URL, headless{true,false}, timeoutValues)
  - src\configuration\waits.js -> different types of waits needed are defined
  - src\lib\commonFunctions.js -> contains all the common functions that are reusable (click, clickXpath, typeText, getText etc)
  - src\pageObjects\page.js -> contains page locators, locators name ending with _XPATH are xpath locators others are query locators. 
  - src\test-setup.js -> contains the test setup methods. Opening the browser instance etc. 
  - package.json -> contains all the dependencies required to run the project
  
  

