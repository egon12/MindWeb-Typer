import Nodes from './nodes.js'

export default class DepGraph extends Nodes {

	constructor(nodes) {
		super(nodes)
		this._checkAcyclic()
		this._setLevel()
	}

	isBounded(id1, id2, exclude) {
		const node1 = this.get(id1)
		const node2 = this.get(id2)
		const excludeNodes = exclude ? exclude.map(this.get): []
		
		return isBounded(node1, node2, excludeNodes)
	}

	uniqueTree(exclude) {
		const excludeNodes = exclude ? exclude.map(this.get) : []

		const cluster = this._cluster(excludeNodes)

		return Object.keys(cluster).reduce((o, id) => ({
			...o, 
			['Tree ' + id]: flattenTree(cluster[id][0], excludeNodes)
		}), {})
	}

	uniqueTreeObject(exclude) {
		const excludeNodes = exclude ? exclude.map(this.get) : []

		const cluster = this._cluster(excludeNodes)

		return Object.keys(cluster).map(k => flattenTree(cluster[k][0], excludeNodes))
	}

	_cluster(excludeNodes) {
		return clustering(this.getZeroImportBy(), (groups, node) => {
			for (let id in groups) {
				if (isBounded(groups[id][0], node, excludeNodes)) {
					return id
				}
			}
			return node.id
		})
	}

	_setLevel() {
		this.getZeroDependencies().forEach(n => setDependencyLevel(n, 0))
		this.getZeroImportBy().forEach(n => setImportLevel(n, 0))
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


function checkCyclic(node, prevNodes, getChildren) {
	const index = prevNodes.indexOf(node)
	if (index > -1) {
		const cyclicArr = prevNodes.filter( (p,i) => i >= index )
		cyclicArr.push(node)
		const cyclicInfo = cyclicArr.map(i => i.id).join(" -> ")
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


function setDependencyLevel(node, level) {
	if (node.dependencyLevel && level <= node.dependencyLevel) {
		return
	}
	node.dependencyLevel = level
	node.importBy.forEach(n => setDependencyLevel(n, level+1))
}

function setImportLevel(node, level) {
	if (node.importLevel && level <= node.importLevel) {
		return
	}
	node.importLevel = level
	node.dependencies.forEach(n => setImportLevel(n, level+1))
}

function clustering(nodes, getGroupId) {
	return nodes.reduce((groups, node) => {
		const id = getGroupId(groups, node);
		groups[id] = groups[id] || []
		groups[id].push(node);
		return groups;
	}, {});
}


function isBounded(node1, node2, excluded) {

	let found = node1.importBy.find(i => i == node2)
	if (found) return true

	found = node1.dependencies.find(i => i == node2)
	if (found) return true

	excluded = [...excluded, node1];

	for (let i=0; i<node1.importBy.length; i++) {
		const node1link = node1.importBy[i]
		if (excluded.find(i => i == node1link)) {
			continue
		}
		found = isBounded(node1link, node2, excluded)
		if (found) return true
	}

	for (let i=0; i<node1.dependencies.length; i++) {
		const node1link = node1.dependencies[i]
		if (excluded.find(i => i == node1link)) {
			continue
		}
		found = isBounded(node1link, node2, excluded)
		if (found) return true
	}

	return false
}

function flattenTree(tree, exclude) {
	let res = tree.dependencies.filter(i => !exclude.find(j => i.id == j.id))
	res.forEach(n => {
		n.dependencies.forEach (m => {
			const childs = flattenTree(m, exclude)
			res = res.concat(childs)
		})
	})
	res.push(tree)
	return res
}


/*

DepGraph interface 

let's try

createDepGraph(content)

dg.uniqueTree(exclude)

dg.tree(id, exclude)

calculate(dg, useImport)

dg.get(id)
*/