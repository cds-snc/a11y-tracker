#!/usr/bin/env node
const program = require('commander');
const {SHA256} = require("sha2");

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
    const clear = key.key
    key.key = SHA256(`${clear}.${process.env.SALT}`).toString("base64")
    key.save().then(() => {
      console.log("API Key for", name, ':', clear)
      return process.exit(0);
    })
    
  })

program.parse(process.argv);


