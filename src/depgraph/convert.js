
export class Nodes {

	constructor(nodes) {
		this.nodes = nodes
	}

	filter(func) {
		return Object.keys(this.nodes)
			.map(name => this.nodes[name])
			.filter(func)
	}

	getZeroDependencies() {
		return this.filter(node => node.dependencies.length == 0)
	}

	getZeroImportBy() {
		return this.filter(node => node.importBy.length == 0)
	}

}

export class DepGraph extends Nodes {

	constructor(nodes) {
		super(nodes)
		this._checkAcyclic()
		this._setLevel()
	}

	get(name) {
		return this.nodes[name]
	}

	_setLevel() {
		
		this.getZeroDependencies().forEach(n => setDependencyLevel(n, 0))
	}

	_checkAcyclic() {
		const zeroImport = this.getZeroImportBy()
		if (zeroImport.length == 0) {
			throw new Error("DepGraph should be acyclic. Cannot find the end of Graph")
		}
		zeroImport.forEach(checkDependencyCyclic)


		const zeroDependencies = this.getZeroDependencies()
		if (zeroDependencies.length == 0) {
			throw new Error("DepGraph should be acyclic. Cannot find the end of Graph")
		}
		zeroDependencies.forEach(checkImportCyclic)
	}


}

export function convert(content) {
	const arrOfArr = content
		.split("\n")
		.map(i => i.split(" ").filter(i => i.length > 0))
		.filter(i => i.length > 0);

	const allNodes = {}

	arrOfArr
		.map(i => i[0])
		.forEach(i => allNodes[i] = {name: i, dependencies: [], importBy: []})

	arrOfArr.filter(i => i.length > 1).forEach(i => {
		const node = allNodes[i[0]]

		for (let j=1; j<i.length; j++) {
			const name = i[j]

			if (node.name == name) {
				throw new Error(`"${name}" cannot import it self`)
			}

			const dependencyNode = allNodes[name]
			if (!dependencyNode) {
				throw new Error(`Cannot find node "${name}"`)
			}

			dependencyNode.importBy.push(node)
			node.dependencies.push(dependencyNode)
		}
	})

	return allNodes
}

function setDependencyLevel(node, level) {
	if (node.dependencyLevel && level <= node.dependencyLevel) {
		return
	}
	node.dependencyLevel = level
	node.importBy.forEach(n => setDependencyLevel(n, level+1))
}

function setImportLevel(node, level) {
	node.importBy = level
	node.dependencies.forEach(n => setDependencyLevel(n, level+1))
}

function checkCyclic(node, prevNodes, getChildren) {
	const index = prevNodes.indexOf(node)
	if (index > -1) {
		const cyclicArr = prevNodes.filter( (p,i) => i >= index )
		cyclicArr.push(node)
		const cyclicInfo = cyclicArr.map(i => i.name).join(" -> ")
		throw new Error("Cyclic on " + cyclicInfo)
	}

	getChildren(node).forEach(n => {
		checkCyclic(n, [...prevNodes, node], getChildren)
	})
}

function checkDependencyCyclic(node) {
	checkCyclic(node, [], n => n.dependencies)
}

function checkImportCyclic(node) {
	checkCyclic(node, [], n => n.importBy)
}


