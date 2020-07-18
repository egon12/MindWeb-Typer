
export default class Nodes {

	constructor(nodes) {
		this.nodes = nodes
		this.get = this.get.bind(this)
	}

	get(id) {
		const node =  this.nodes[id]
		if (!node) {
			throw new Error("Cannot find " + id)
		}
		return node
	}

	filter(func) {
		return Object.keys(this.nodes)
			.map(id => this.nodes[id])
			.filter(func)
	}

	getZeroDependencies() {
		return this.filter(node => node.dependencies.length == 0)
	}

	getZeroImportBy() {
		return this.filter(node => node.importBy.length == 0)
	}

}
