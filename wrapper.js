const newman = require('newman');
const fs = require('fs');
const path = require('path');
const {program: commander} = require('commander');
const { error } = require('console');

commander
     .version('1.0.0', '-v, --version')
     .usage('[OPTIONS]...')
     .requiredOption(
        '-c, --collectionFilePath <value>',
        'Use an postman collection file path (exported from postman).'
    )
     .option(
          '-e, --envVarFilePath <value>',
          'Use an environment variable file path containing key value pairs.'
     )
     .parse(process.argv);

const options = commander.opts();

if(!fs.existsSync(options.collectionFilePath)){
    console.error("Could not find collection file");
}

function parseKeyValueFile(filePath) {
     const data = fs.readFileSync(filePath, 'utf8');
     const lines = data.split('\n');
     const result = [];

     lines.forEach((line) => {
          const [key, value] = line.split('=');
          if (key && value) {
               result.push({ key: key.trim(), value: value.trim() });
          }
     });

     return result;
}

const environmentVariables = options.envVarFilePath
     ? parseKeyValueFile(options.envVarFilePath)
     : {};

newman
     .run({
          collection: options.collectionFilePath,
          reporters: ['html'],
          envVar: environmentVariables,
     })
     .on('start', function (err, args) {
          console.log('Collection running');
     })
     .on('done', function (err, summary) {
          console.log('Collection done');

          if (err || summary.error) {
               console.error('Collection error found');
          }
     });
