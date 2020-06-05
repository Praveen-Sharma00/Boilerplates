const chalk = require('chalk');

const logger = console.log
global.logError = (text) => logger(chalk.red.bold(text));
global.logInfo = (text) => logger(chalk.blueBright.bold(text));
global.logSuccess = (text) => logger(chalk.greenBright.bold(text));