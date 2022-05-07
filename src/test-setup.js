const puppeteer = require('puppeteer')
const { chromium, firefox, webkit } = require('playwright')
const { expect } = require('chai')
const config = require('./configuration/config')
// const email = require('../lib/utility/email')
const _ = require('lodash')
const fs = require('fs')
const globalVariables = _.pick(global, [
	'browser',
	'expect',
	'log4js',
	'report',
	'fs',
	'testLevel',
	'myGIF',
	'emoji',
	'puppeteer',
])
// const testLevel = require('../constants/report')
require('mocha-allure-reporter')
const myGIF = require('gif-creation-service')
const emoji = require('node-emoji')
const perf = require('execution-time')()
const log4js = require('log4js')
global.log4js = log4js
module.exports = {
	jiraLogFile: null,
	browserLaunchOptions: {
		headless: config.isHeadless,
		slowMo: config.slowMo,
		devtools: config.isDevtools,
		timeout: config.launchTimeout,
		defaultViewport: config.defaultViewport,
		viewport: config.defaultViewport,
		setViewportSize: config.defaultViewport,
		args: [
			'--start-maximized',
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			`--window-size=${config.VIEW_PORT}`,
		],
	},
	modes: {
		DISABLED: 'DISABLED',
		BASIC_SANITY: 'BASIC_SANITY',
		DETAILED_SANITY: 'DETAILED_SANITY',
		TSP: 'TSP',
		ONLY: 'ONLY',
		DEFECTED: 'DEFECTED',
	},
	mode: function (type = 'TSP') {
		//Fucntion to check test annotation

		// if type received is disabled return false to skip the test
		if (type === this.modes.DISABLED) return false;
		
		let mode = getProcessMode()
		mode = mode.toUpperCase()
		type = parseToArray(type)

		if (!isValidMode(mode)) {
			// is invalid mode received from command throw exception
			console.error('Invalid test case execution mode found : ' + mode)
			throw 'Invalid test case execution mode found : ' + mode
		}
		switch (mode) {
			case this.modes.ONLY:
				return type.includes(module.exports.modes.ONLY)
			case this.modes.BASIC_SANITY:
				return type.includes(module.exports.modes.BASIC_SANITY)
			case this.modes.DETAILED_SANITY:
				return (
					type.includes(module.exports.modes.DETAILED_SANITY) ||
					type.includes(module.exports.modes.BASIC_SANITY)
				);
			case this.modes.DISABLED:
            	return false;
			case this.modes.TSP:
				return type.includes(module.exports.modes.TSP)
			case this.modes.DEFECTED:
				return type.includes(module.exports.modes.DEFECTED)
		}
	},
}
// const parallel = require('./test-setup-parallel')

before(async () => {
	global.expect = expect
	global.fs = fs
	// global.testLevel = testLevel
	global.report = true //true for allure false for mocahawesome
	global.myGIF = myGIF
	global.emoji = emoji
	global.puppeteer = puppeteer

	if (config.RUN_BY.LIBRARY.localeCompare('puppeteer') == 0) {
		config.RUN_BY.LIBRARY = true
		global.browser = await puppeteer.launch(module.exports.browserLaunchOptions)
	} else {
		config.RUN_BY.LIBRARY = false
		if (config.RUN_BY.BROWSER.localeCompare('firefox') == 0) {
			global.browser = await firefox.launch(module.exports.browserLaunchOptions)
		} else {
			global.browser = await chromium.launch(
				module.exports.browserLaunchOptions
			)
			global.browser = await global.browser.newContext({ viewport: null })
		}
	}
	try {
		perf.start('Test')
	} catch (error) {
		console.error('Unable to Execu Logs ' + error)
	}
})
after(async () => {
	try {
		const results = perf.stop('Test')
		console.log(
			`Your HeadLess mode is ${config.isHeadless} and Total time taken is ${results.preciseWords}`
		) // in words
	} catch (error) {
		console.error('Unable to Test Execution Time' + error)
	}
	try {
		await browser.close()
		/* if (config.sendEmail) { //TODO Temoporary Disabled the Suite Email
			email.sendEmail(config.userEmail, config.userPassword)
		} */
		global.browser = globalVariables.browser
		global.expect = globalVariables.expect
	} catch (error) {
		console.error(error)
	}
})
const isValidMode = mode => {
	let isValid = false
	Object.keys(module.exports.modes).forEach(key => {
		if (key === mode) isValid = true
	})
	return isValid
}
const parseToArray = seqArray => {
	if (!seqArray && parseFloat(seqArray) != 0) return []

	if (Array.isArray(seqArray)) {
		return seqArray
	}

	if (Number.isInteger(seqArray).toString()) {
		seqArray = seqArray.toString()
	}

	return seqArray.split(',')
}
const getProcessMode = function () {
	try {
		/*let modeFound = process.argv[process.argv.length - 1].split('=') //TODO , Currently we expect last parameter should be mode
		if (module.exports.modes.hasOwnProperty(modeFound[1])) {
			console.log(`Mode found ${modeFound[1]}`)
			finalMode = modeFound[1]
		} else {
			console.log(
				`No relevent Mode found ${modeFound} We are setting the default Mode ${finalMode}`
			)
    }*/
		const commandPrefix = '--mode'
		let mode =
			process.argv.find(i => i.startsWith(commandPrefix)) || '--mode=TSP'
		return mode.split('=')[1]
	} catch (error) {
		console.log(
			`There is an Error while fininding the mode argumnet, We are setting TSP as a mode --> ${error}`
		)
	}
}
