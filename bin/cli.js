#!/usr/bin/env node
const program = require('commander');

program
  .version('0.0.1')
  .command('key <name>')
  .description('Generates an API key for and organisation')
  .action((name) => {
    require('./../db')
    const ApiKey = require('../models/api-key.js')
    console.log("Generating API key for", name, "...")
    const key = new ApiKey({
      organisation: name,
    })
    key.save().then(() => {
      console.log("API Key for", name, ':', key.key)
      return process.exit(0);
    })
    
  })

program.parse(process.argv);


