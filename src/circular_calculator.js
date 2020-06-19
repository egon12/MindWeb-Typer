export default class CircularCalculator {
	addRadians(inputTree) {
		const newTree = { ...inputTree };
		return _addRadians(newTree, 0, 2 * Math.PI, true);
	}
}

function _addRadians(tree, radiansFrom, radiansTo, firstLevel) {
	const radiansRange = radiansTo - radiansFrom;
	const divider = firstLevel
		? tree.children.length
		: tree.children.length + 1;
	const radiansAddition = radiansRange / divider;
	tree.children = tree.children.map((child, index) => {
		let radians = radiansFrom + (index + 1) * radiansAddition;

		if (radians >= 2 * Math.PI) {
			radians -= 2 * Math.PI;
		}

		const newRadiansFrom = radians - radiansAddition / 2;
		const newRadiansTo = radians + radiansAddition / 2;
		const newChild = _addRadians(child, newRadiansFrom, newRadiansTo);

		return {
			...newChild,
			radians
		};
	});
	return tree;
}
