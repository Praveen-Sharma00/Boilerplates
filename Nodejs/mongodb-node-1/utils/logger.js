const chalk = require('chalk');


const logger = console.log

global.logInfo = (text)=>logger(chalk.blueBright.bold(text))
global.logError = (text)=>logger(chalk.red.bold(text))
global.logSuccess = (text)=>logger(chalk.greenBright.bold(text))
