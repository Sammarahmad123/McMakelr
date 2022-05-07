module.exports = {
    /**
     * {BASE_URL}: URL where your Tango is Hosted
     * must end with slash
     */
    baseURL: 'https://admin-advertisement.herokuapp.com/advertisements',
    /**
     * {USER_NAME}: Username of a Tango+, recommended to use their default Users
     */

    API_baseURL: 'https://admin-advertisement.herokuapp.com/api/advertisements/',


    /**
     * {IS_HEADLESS}: Run Your Test in HEADLESS Mode ,
     * true: Run in background
     * false: View actions perform on browser
     */
    isHeadless: false,
    VIEW_PORT: "1920,870",
    /*
    *{SLOW_MOTION}: Run Your Test in HEADLESS Mode ,
    *Added slowMotion to 10 milliseconds for stabilize the test case execution*.
    *Slow the Puppeteer operations to browser, so that instead of adding manual wait in code we use its slowmo feature.
    *However its only 10 millisecond that is nothing for a human but huge for a ROBOT.
    *Why we add SlowMo:
    *a) On some clicks structure of a DOM is changed in Tango+ , for performing a consistent execution of a test we add it.
    *b) After adding this, actions performed on a element and there response in DOM structure completely render then we perform action on that element smoothly.
    *
    */
    slowMo: 10,
    /**
     * {IS_DEVELOPER_TOOL}: 
     * true:show developer tool with your each action 
     */
    isDevtools: false,
    /**
     * {LAUNCH_TIMEOUT}: Timeout in which Puppeteer Launch its browser 
     * must be in milliseconds
     */
    launchTimeout: 180000,
    /**
     * {WAITING_TIMEOUT}: Timeout used in  WaitForSelector 
     * must be in milliseconds
     */
    waitingTimeout: 3000,
    /**
     * {NAVIGATION_TIMEOUT}: Timeout used for navigation between the pages and new URL's 
     * must be in milliseconds
     */
    navigationTimeOut: 180000,
    /**
     * {DEFAULT_VIEW_PORT}: null for Maximized
     */
    defaultViewport: null,
    
    /**
     * {RUN_BY} : RUN_BY is a flag which is used to execute with different node library 
     * {LIBRARY}: Library by which you want to execute zeus. possible value (puppeteer or playwright)
     * {BROWSER}: Browser in which you want to execute zeus. For puppeteer only chrome is supportable
     */
    RUN_BY: {
        LIBRARY: "puppeteer",
        BROWSER: "chrome",
    },
    TEMP_FILES_DIRECTORY: "tempScreenShots/"
}
