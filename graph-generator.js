const Project = require('@lerna/project');
const PackageGraph = require('@lerna/package-graph');
const plantuml = require('node-plantuml');

function generatePlantUml(graph) {
    const chartText = [];
    const packNames = [];
    graph.forEach(pack => {
        packNames.push(pack.name.replace(/-/g, '_'));
        pack.localDependencies.forEach(dep => {
            chartText.push(`${pack.name.replace(/-/g, '_')} --> ${dep.name.replace(/-/g, '_')}`);
        })
    });
    return [
        '@startuml',
        'skinparam linetype ortho',
        'skinparam monochrome true',
        'skinparam shadowing false',
        'skinparam nodeFontSize 15',
        packNames.map(pack => `node ${pack}`).join('\n'),
        chartText.join(`\n`),
        '@enduml'
    ].join('\n').replace(/@[\w\-]+\//g, '');
}

async function getGraphFromLernaPath(lernaPath) {
    const project = new Project(lernaPath);
    const packages = await project.getPackages();
    return new PackageGraph(packages);
}

function createPngBufferFromPlantUml(uml) {
    plantuml.useNailgun();
    return new Promise((resolve, reject) => {
        plantuml.generate(uml, {}, function (err, buffer) {
            if (!buffer.length) reject(new Error('Buffer length is zero. Verify java if java is installed.'))
            else resolve(buffer);
        });
    });
}

function createTgfBufferFromGraph(graph) {
    const nodes = [];
    const edges = [];
    graph.forEach(pack => {
        nodes.push(pack.name);
    });
    graph.forEach(pack => {
        pack.localDependencies.forEach(dep => {
            edges.push(`${nodes.indexOf(pack.name)} ${nodes.indexOf(dep.name)}`);
        });
    });
    const str = nodes
        .map((node, index) => `${index} ${node}`)
        .join('\n') + '\n#\n' + edges.join('\n');
    return Buffer.from(str, 'utf-8');
}

const generateGraphBufferLernaPath = async (lernaPath, format = 'png') => {
    const graph = await getGraphFromLernaPath(lernaPath);

    if (format === 'png') {
        const uml = generatePlantUml(graph);
        return createPngBufferFromPlantUml(uml);
    } else if (format === 'tgf') {
        return createTgfBufferFromGraph(graph);
    } else if (format === 'puml') {
        return Buffer.from(generatePlantUml(graph), 'utf-8');
    }
};


module.exports = {
    generateGraphBufferLernaPath,
};
