export default class DagExplorerTextManager {

	constructor(content) {
		this.content = content
	}

	getRoot() {
		return this.content
	}

	getID(idStr) {
		const arrOfArr = this.content
			.split("\n")
			.map(i => i.split(" ").filter(i => i.length > 0))

		const selectedNode = arrOfArr.find(i => i[0] == idStr)
		
		const dependToNode = arrOfArr
			.filter(i => i.indexOf(idStr) > -1 && i[0] != idStr)
			.map(i => [i[0], idStr])

		const needByNode = selectedNode.filter(i => i != idStr)
			.map(i => [i])

		return [selectedNode]
			.concat(dependToNode)
			.concat(needByNode)
			.map(i=> i.join(" "))
			.join("\n")
	}
}
