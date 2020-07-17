import DepGraph from "./depgraph";

export function convert(content) {
	const arrOfArr = content
		.split("\n")
		.map(i => i.split(" ").filter(i => i.length > 0))
		.filter(i => i.length > 0);

	const allNodes = {};

	arrOfArr
		.map(i => i[0])
		.forEach(
			i => (allNodes[i] = { id: i, dependencies: [], importBy: [] })
		);

	arrOfArr
		.filter(i => i.length > 1)
		.forEach(i => {
			const node = allNodes[i[0]];

			for (let j = 1; j < i.length; j++) {
				const id = i[j];

				if (node.id == id) {
					throw new Error(`"${id}" cannot import it self`);
				}

				const dependencyNode = allNodes[id];
				if (!dependencyNode) {
					throw new Error(`Cannot find node "${id}"`);
				}

				dependencyNode.importBy.push(node);
				node.dependencies.push(dependencyNode);
			}
		});

	return allNodes;
}

export function convertToDepGraph(content) {
	const nodes = convert(content);
	return new DepGraph(nodes);
}

export function toDrawableData(depgraph) {
	return Object.values(depgraph.nodes).map(i => ({
		id: i.id,
		link: i.dependencies.map(j => j.id),
		x: i.x,
		y: 100 * i.dependencyLevel,
		color: 'steelblue',
	}))
}

export function toThreeLevel(dg, id) {

	const node = dg.get(id)

	const maxX = Math.max(node.dependencies.length, node.importBy.length)
	
	const ds = toThreeLevelDrawable(node.dependencies, id, 0, maxX)
	const ib = toThreeLevelDrawable(node.importBy, id, 200, maxX)
	const all = ds.concat(ib)

	all.push({
		id: node.id,
		link: [id],
		color: 'steelblue',
		x: (maxX + 1) / 2,
		y: 100,
	})

	return all
}

function toThreeLevelDrawable(nodes, linkId, y, maxX) {
	const mtpl = (maxX + 1) /  (nodes.length + 1)
	return nodes.map((n, i) => ({
		id: n.id,
		link: [linkId],
		color: 'steelblue',
		y,
		x: (i + 1) * mtpl
	}))
}
