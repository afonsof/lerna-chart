#!/usr/bin/env node

const fs = require('fs');
const {generateImageBufferFromLerna} = require("./index");

(async ()=>{
  const pwd = process.argv.length > 2 ? process.argv[2] : process.cwd();
  const filePath = process.argv.length > 3 ? process.argv[3] : 'lerna-chart.png';

  const buffer = await generateImageBufferFromLerna(pwd);
  await fs.writeFileSync(filePath, buffer);
})();
