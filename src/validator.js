// NPM Packages
const Ajv = require('ajv');
const fs = require('fs');

// Schema & Data
const schema = fs.readFileSync('./src/schemas/index.json');
const data = fs.readFileSync('./src/data/example-portfolio/index.json');

const ajv = new Ajv({
  allErrors: true,
}); // options can be passed, e.g. {allErrors: true}

const validate = ajv.compile(schema);

const valid = validate(data);

if (!valid) {
  console.log(validate.errors);
}
