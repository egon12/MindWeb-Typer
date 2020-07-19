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
export function calculate(dg, useImport) {
	if (useImport) {
		setX_ImportLevel(dg)
		setY_ImportLevel(dg)
	} else {
		setX_DependencyLevel(dg)
		setY_DependencyLevel(dg)
	}
}

export function setX_DependencyLevel(dg) {
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

export function setX_ImportLevel(dg) {
	const maxLevel = Math.max(...dg.getZeroDependencies().map(i => i.importLevel)) + 1

	const levels = [...Array(maxLevel).keys()].map( i => dg.filter(n => n.importLevel == i));

	const maxX =  Math.max(...levels.map(i => i.length))

	levels.forEach(nodes => {
		const xMultipl = (maxX + 1)/ (nodes.length + 1)
		nodes.forEach((n,i) => {
			n.x = (i+1) * xMultipl
		})
	})
}

export function setY_DependencyLevel(dg) {
	Object.values(dg.nodes).forEach(n => n.y = n.dependencyLevel * 100)
}

export function setY_ImportLevel(dg) {
	Object.values(dg.nodes).forEach(n => n.y = n.importLevel * -100)
}

function calculateSingleTree(dependencies) {
	const maxX = findMaxX(dependencies)
	fillX(dependencies, maxX)
}

function fillX(dependencies, maxX) {
	const multiplier = maxX / depdencies.length 
}