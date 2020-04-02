const fs = require("fs");
const {expect} = require("chai");
const {generateGraphBufferLernaPath} = require("../graph-generator");
const png = require('png-js');

describe('test render', () => {
  it('should render png', async () => {
    const buffer = await generateGraphBufferLernaPath('example');
    const outPath = __dirname + '/out/out.png';
    fs.writeFileSync(outPath, buffer);
    png.decode(outPath, function (outPixels) {
      png.decode('test/example-test-output.png', function (expectedPixels) {
        expect(outPixels).to.be.eql(expectedPixels);
      });
    });
  });

  it('should render tgf', async () => {
    const buffer = await generateGraphBufferLernaPath('example', 'tgf');
    fs.writeFileSync(__dirname + '/out/out.tgf', buffer);

    const expected = '0 pack1\n1 pack2\n#\n1 0';

    expect(buffer.toString()).to.be.equal(expected);
  });

  it('should render puml', async () => {
    const buffer = await generateGraphBufferLernaPath('example', 'puml');
    fs.writeFileSync(__dirname + '/out/out.puml', buffer);

    const expected = [
      '@startuml',
      'skinparam linetype ortho',
      'skinparam monochrome true',
      'skinparam shadowing false',
      'skinparam nodeFontSize 15',
      'node pack1',
      'node pack2',
      'pack2 --> pack1',
      '@enduml'
    ].join('\n');
    expect(buffer.toString()).to.be.equal(expected);
  });
});
