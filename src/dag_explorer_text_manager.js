export default class DagExplorerTextManager {

	constructor(content) {
		this.content = content
	}

	getRoot() {
		return this.content
	}

	getID(idStr) {
		return this.content
			.split("\n")
		  .map(i => i.split(" ").filter(i => i.length > 0))
			.filter(i => i.indexOf(idStr) > -1)
			.map(i => i[0] == idStr ? i : i.filter( (item, index) => index == 0 || item == idStr))
		  .map(i => i.join(" "))
			.join("\n")
	}

}
