import DepGraph from './depgraph'

/*

ok there are some problem that I need to resolve..
the problem maybe are someting that I need to think..
To make it flat..
To find and to make it flat..
And then to mark it again..

ho to seperate it into depgraph..

I still need to make it seperate first..

*/
export function calculate(dg) {
	setX(dg)
}

function setX(dg) {
	const maxLevel = Math.max(...dg.getZeroImportBy().map(i => i.dependencyLevel)) + 1

	const levels = [...Array(maxLevel).keys()].map( i => dg.filter(n => n.dependencyLevel == i));

	const maxX =  Math.max(...levels.map(i => i.length))

	levels.forEach(nodes => {
		const xMultipl = (maxX + 1)/ (nodes.length + 1)
		nodes.forEach((n,i) => {
			n.x = (i+1) * xMultipl
		})
	})
}

function calculateSingleTree(dependencies) {
	const maxX = findMaxX(dependencies)
	fillX(dependencies, maxX)
}

function fillX(dependencies, maxX) {
	const multiplier = maxX / depdencies.length 
}