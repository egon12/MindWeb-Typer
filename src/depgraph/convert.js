import DepGraph from "./depgraph";
import DrawableDepGraph from './drawable_depgraph'



export function convert(content) {
	const arrOfArr = content
		.split("\n")
		.map(i => i.split(" ").filter(i => i.length > 0))
		.filter(i => i.length > 0);

	const allNodes = {};

	arrOfArr
		.map(i => i[0])
		.forEach(
			i => (allNodes[i] = { id: i, dependencies: [], importBy: [], isLibrary: (i[0] != '.' && i != 'stdlib') })
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

export function convertToDrawableDepGraph(content) {
	const nodes = convert(content);
	return new DrawableDepGraph(nodes);
}

export function toDrawableData(depgraph) {
	return Object.values(depgraph.nodes).map(i => ({
		id: i.id,
		link: i.dependencies.map(j => j.id),
		x: i.x,
		y: i.y,
		color: 'steelblue',
	}))
}

