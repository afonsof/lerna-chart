const Project = require('@lerna/project');
const PackageGraph = require('@lerna/package-graph');
const plantuml = require('node-plantuml');

const generateImageBufferFromLerna = async (lernaPath) => {
    const project = new Project(lernaPath);
    const packages = await project.getPackages();
    const graph = new PackageGraph(packages);

    const chartText = [];
    const packNames = [];
    graph.forEach(pack => {
        packNames.push(pack.name.replace(/-/g, '_'));
        pack.localDependencies.forEach(dep=>{
            chartText.push(`${pack.name.replace(/-/g, '_')} --> ${dep.name.replace(/-/g, '_')}`);
        })
    });
    const uml = `@startuml
    skinparam linetype ortho
    skinparam monochrome true
    skinparam shadowing false
    skinparam nodeFontSize 15
    ${packNames.map(pack=>`node ${pack}`).join('\n')}
    ${chartText.join(`\n`)}
    @enduml`.replace(/@gupy\//g, '');

    let gen = plantuml.generate(uml);
    let buffers = [];

    return new Promise((resolve)=> {
        gen.out.on("data", data => {
            buffers.push(data);
        });
        gen.out.on("close", () => {
            resolve(Buffer.concat(buffers));
        });
    });
};


module.exports = {
    generateImageBufferFromLerna,
};
