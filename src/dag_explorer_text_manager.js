export default class DagExplorerTextManager {
	constructor(content) {
		this.content = content;
		this.allNodes = constructObject(this.content)
	}

	getRoot() {
		return this.content;
	}

	getID(idStr) {
		const node = this.allNodes[idStr]

		const name = node.name

		const selectedNode = node.dependencies.map(i => i.name)
		selectedNode.unshift(name)

		const dependToNode = node.importBy.map(i => [i.name, name])

		const needByNode = node.dependencies.map(i => [i.name])

		return [selectedNode]
			.concat(dependToNode)
			.concat(needByNode)
			.map(i => i.join(" "))
			.join("\n");
	}

	shouldBeGroup(input1, input2) {}

	uniqueTree(exclude) {
		const mostBound = this.getNodeNotImported()

		isBounded(mostBound[0], mostBound[1], exclude || [])
	}

	getAllDependencies(idStr) {
		const node = this.allNodes[idStr]
	}

	getFreeDependencies() {
		let result = []
		for (let key in this.allNodes) {
			const node = this.allNodes[key]
			if (node.dependencies.length == 0) {
				result.push(node)
			}
		}
		return result
	}

	getNodeNotImported() {
		let result = []
		for (let key in this.allNodes) {
			const node = this.allNodes[key]
			if (node.importBy.length == 0) {
				result.push(node)
			}
		}
		return result
	}

	isBounded(name1, name2, exclude) {
		const node1 = this.allNodes[name1]
		const node2 = this.allNodes[name2]
		const excludeNodes = exclude ? exclude.map(i => this.allNodes[i]): []
		
		return isBounded(node1, node2, excludeNodes)
	}
}

function constructObject(content) {
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
				throw new Error("Cannot import it self")
			}

			const dependencyNode = allNodes[name]
			if (!dependencyNode) {
				throw new Error("Cannot find " + name)
			}

			dependencyNode.importBy.push(node)
			node.dependencies.push(dependencyNode)
		}
	})

	return allNodes
}


function isBounded(node1, node2, excluded) {

	let found = node1.importBy.find(i => i == node2)
	if (found) return true

	found = node1.dependencies.find(i => i == node2)
	if (found) return true

	excluded.push(node1)

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
