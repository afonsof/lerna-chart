const fs = require("fs");
const { expect } = require("chai");
const {generateImageBufferFromLerna} = require("../index");

it('should render the image', async () => {
  const buffer = await generateImageBufferFromLerna('example');
  const testOutput = fs.readFileSync('test/example-test-output.png');
  expect(buffer.toString()).to.be.equal(testOutput.toString());
});
