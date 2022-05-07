/**
 * wait:
 * File that contains all the wait used in UI Test
 */
module.exports = {
    networks: {
        NETWORK_IDEAL_0: "networkidle0"
    },
    UPLOAD_FILE: 1000,
    PROJECT_EDITOR: {
        DATABASE_INPUT_MAPPING: 3000,
        OPEN_DATA_MAP: 5000,
        DATABASE_OUTPUT: {
            MAP_RECORD: 1000,
        },
        GENERIC_WAITING:2000,
        XML_DATA_MAPPING: 3000,
        DELIMITED_INPUT_MAPPING: 5000, // Wait for the datafile to load completely after data mapping
    },
    DOCUMENT_CONFIURATION: 8000,
    USER_MANAGEMENT: {
        DELETE_ROLE: 3000
    },
    PRODUCTION: {
        WATCH: {
            WATCH_PRODUCTION: 16000, //On Job monitor, refresh rate is increased so wait is added TG-39384
            DROP_DATA_FILE: 10000
        }
    },
    DESIGNER: {
        LOADING: {//Time must be in Minutes
            OPENING_TDF: 6,
            LOADING_PAGE: 2,
            SAVING_TDF: 3,
            LOADING_SINGLE_PAGE: 1
        },
        WAIT_TO_SYNC:7000 ,//wait to let last sync complete
		WAIT_TO_LOAD_PDF_PREVIEW:6000 //wait to let the pdf preview page load
    },
    MOCHA_DONE: 8000
}