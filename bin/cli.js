#!/usr/bin/env node
var _routesConfig = require('../config/routes.config.js')
const path = require('path')
const fs = require('fs');


const commander = require('commander')
const program = new commander.Command()
program.version('0.0.1')

program.option('a11y', 'Generates the a11y json')
program.option('routes', 'Prints out all the routes')
program.option('-k, --key <name>', 'Generates an API key for and organisation')

program.parse(process.argv)

if (program.a11y) {
  const paths = _routesConfig.routes.map(p => p.path.replace("/", ""))
  const object = {"urls": paths}
  const outDir = path.join(process.cwd())
  const outFile = "a11y.json"

  fs.writeFile(`${outDir}/${outFile}`, JSON.stringify(object), function (err) {
    if (err) throw err;
    console.log('Wrote paths for a11y checker');
  });

}

if (program.routes) {
  console.log(_routesConfig.routes)
}

if (program.key) {
  //require('./db')
  const ApiKey = require('../models/api-key.js')
  console.log("Generating API key for", program.key, "...")
  const key = new ApiKey({
    organisation: program.key,
  })
  //await key.save() 
  console.log("API Key for", program.key, ':', key.key)
}