import PositionCalculator from "./position_calculator";
import SVGPainter from "./interactive_svg_painter";
import { convertToDrawableDepGraph } from './depgraph/convert'


// maybe we need to present with state like redux or something
const viewType = {
	SELECT_TREE: 'select_tree',
	TREE: 'tree',
	NODE: 'node',
}

const state = {
	viewType: viewType.SELECT_TREE,
	root: {},
	trees: {},
	selectedTree: "",
	selectedNode: "",
	useImportLevel: false,
	uniqueTreeExclude: [],
}

const actionType = {
	LOAD: 'load',
	UP: 'up',
	CLICK_ROOT: 'click_root',
	CLICK_SELECT_TREE: 'click_select_tree',
	CLICK_NODE: 'click_node',
	CTRL_CLICK_NODE: 'ctrl_click_node',
	USE_IMPORT_CHANGE: 'use_import_change',
}



// reducer but muttable
function reducer(oldState, action) {
	console.log(oldState, action)
	switch(action.type) {
		case actionType.CLICK_NODE: 
		if (oldState.viewType == viewType.SELECT_TREE) {
			oldState.viewType = viewType.TREE
			oldState.selectedTree = action.value
		} else if (oldState.viewType == viewType.TREE) {
			oldState.viewType = viewType.NODE
			oldState.selectedNode = action.value
		}
		break
		case actionType.UP:
		if (oldState.viewType == viewType.NODE) {
			oldState.viewType = viewType.TREE
		} else if (oldState.viewType == viewType.TREE) {
			oldState.viewType = viewType.SELECT_TREE
		}
		break

		case actionType.CLICK_SELECT_TREE:
			oldState.viewType = viewType.SELECT_TREE
			break

		case actionType.USE_IMPORT_CHANGE:
			oldState.useImport = action.value
			break

	}

	console.log(oldState)
	return oldState
}


class DagExplorer {
	constructor(content, config) {
		this.config = config;
		this.position = new PositionCalculator();
		this.painter = new SVGPainter();
		this.painter.init(config);


		this.draw = this.draw.bind(this);
		this.painter.onclick = this.clickId.bind(this);


		const rootDG = convertToDrawableDepGraph(content)

		this.state = {
			viewType: viewType.SELECT_TREE,
			root: rootDG,
			trees: rootDG.getDrawableTrees(),
			selectedTree: "",
			selectedNode: "",
			useImportLevel: false,
			uniqueTreeExclude: [],
		}

		this.data = undefined
	}

	clickSelectTree() {
		this.state = reducer(this.state, {type: actionType.CLICK_SELECT_TREE})
		this.drawState(this.state)
	}

	clickRoot() {
		this.state = reducer(this.state, {type: actionType.CLICK_ROOT, value: 'root'})
		this.drawState(this.state)
	}

	clickUp() {
		this.state = reducer(this.state, {type: actionType.UP})
		this.drawState(this.state)
	}

	clickId(id) {
		this.state = reducer(this.state, {type: actionType.CLICK_NODE, value: id})
		this.drawState(this.state)
	}

	setUseImport(value) {
		this.state = reducer(this.state, {type: actionType.USE_IMPORT_CHANGE, value})
		this.drawState(this.state)
	}

	draw(data) {
		const nodes = this.position.calculateNodePosition(data, this.config);
		const edges = this.position.calculateEdgePoints(nodes, this.config);
		this.painter.drawEdges(edges, this.config);
		this.painter.drawNodes(nodes, this.config);
	}

	drawState(state) {
		switch(state.viewType) {
			case viewType.TREE:
				this.drawTree(state)
				break
			case viewType.NODE:
				this.drawNode(state)
				break
			case viewType.SELECT_TREE:
				this.drawSelectTree(state)
				break
		}
	}

	drawNode(state) {
		const data = state.root.getDrawableNode(state.selectedNode)
		this.draw(data)
	}

	drawTree(state) {
		const data = state.trees[state.selectedTree].getDrawable(state.useImport)
		this.draw(data)
	}

	drawSelectTree(state) {
		const data = Object.keys(state.trees).map((dg, i) => ({ id: dg, x: i, y: 1, color: 'steelblue' }))
		this.draw(data)
	}


}

const config = {
	container: {
		id: "#container",
		width: global.innerWidth - 10,
		height: global.innerHeight - 10
	},
	rect: {
		width: global.innerWidth / 10,
		height: global.innerHeight / 10
	},
	expandToggle: {
		radius: 10,
	},
	font: {
		family: "Helvetica",
		size: 14
	}

};

const explorer = new DagExplorer(global.dag_content, config);
console.log(explorer)
explorer.clickRoot();

global.document.querySelector("#root").onclick = () => explorer.clickRoot();
global.document.querySelector("#select_tree").onclick = () => explorer.clickSelectTree();
global.document.querySelector("#up").onclick = () => explorer.clickUp();
global.document.querySelector('#useimport').onchange = (e) => explorer.setUseImport(e.target.checked)
