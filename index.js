const data = require('./chart.json');

const nodes = [];
const axis = [];

Object.keys(data).forEach(key=> {
    if (!nodes.includes(key)) {
        nodes.push(key);
    }
});

Object.entries(data).forEach(([key, values])=>{
    values.forEach(value => {
        if(!nodes.includes(value)){
            return;
            nodes.push(value);
        }
        axis.push([nodes.indexOf(key) + 1, nodes.indexOf(value) + 1])
    });
});

const nodesStr = nodes.map((cur, index)=>{
    return `${index+1} ${cur}\n`
}).join('\n');

const axisStr = axis.map((cur)=>{
    return `${cur[0]} ${cur[1]}\n`
}).join('\n');

console.log(`${nodesStr}#\n${axisStr}`);