/**
 *  This file contains all elements of the Advertisement Page
 */
 module.exports = {
    FORM_PAGE :{
        ADVERTISEMENT_FIELD : '[name="name"]',
        STREET_FIELD : '[name="street"]',
        ROOM_FIELD : '[name="rooms"]',
        PRICE_FIELD : '[name="price"]',
        STATUS_CHECKBOX : '[type="checkbox"][role="checkbox"]',
        SAVE_BUTTON_XPATH : '//span[contains(text(),"save")]',
        DISABLE_SAVE_BUTTON: '[disabled="disabled"]',
        INVALID_PRICE_ERROR_MSG_XPATH: '//div[contains(text(),"Invalid price(Valid currency in euros:")]'
    },

    HOME_PAGE :{
        CREATE_AD_BUTTON_XPATH : ' //*[contains(text(),"add_circle_outline")]',
        AD_NAME_FIELD_XPATH:'//td[contains(text(),"This is an AD")]',

    }
}