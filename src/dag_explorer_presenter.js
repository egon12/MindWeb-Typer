import PositionCalculator from "./position_calculator";
import SVGPainter from "./interactive_svg_painter";
import { convertToDrawableDepGraph } from './depgraph/convert'


// maybe we need to present with state like redux or something
const viewType = {
	SELECT_TREE: 'select_tree',
	LIST: 'list',
	TREE: 'tree',
	NODE: 'node',
}

const state = {
	viewType: viewType.SELECT_TREE,
	root: {},
	trees: {},
	selected: "",
	nodeList: [],
	useImportLevel: false,
	uniqueTreeExclude: [],
}

const actionType = {
	LOAD: 'load',
	CLICK_ROOT: 'click_root',
	CLICK_NODE: 'click_node',
	CLICK_TOGGLE_TREE: 'click_toogle_tree',
	CTRL_CLICK_NODE: 'ctrl_click_node',
	USE_IMPORT_CHANGE: 'use_import_change',
	CLICK_NOT_IMPORT: 'click_not_import',
	SEARCH: 'search',
}



// reducer but muttable
function reducer(oldState, action) {
	switch(action.type) {
		case actionType.CLICK_NODE: 
			if (oldState.viewType == viewType.LIST) {
				oldState.viewType = viewType.TREE
			}

			oldState.selected = action.value
			break

		case actionType.CLICK_ROOT:
			oldState.viewType = viewType.TREE
			oldState.selected = 'root'
			break

		case actionType.CLICK_NOT_IMPORTED:
			oldState.viewType = viewType.LIST
			oldState.nodeList = oldState.root.getZeroImportBy().map((n,i) => ({
				id: n.id,
				x: i%9,
				y: parseInt(i/9),
				color: 'steelblue',
				link: [],
			}))
			break

		case actionType.CLICK_TOGGLE_TREE:
			if (oldState.viewType == viewType.TREE) {
				oldState.viewType = viewType.NODE
			} else {
				oldState.viewType = viewType.TREE
			}
			break

		case actionType.SEARCH:
			console.log(action.value.length)
			if (action.value.length > 0) {
				oldState.nodeList = oldState.root
					.filter(it => it.id.indexOf(action.value) > -1)
					.filter((it, index) => index < 60)
					.map((n,i) => ({
						id: n.id,
						x: i%9,
						y: parseInt(i/9),
						color: 'steelblue',
						link: [],
					}))

				oldState.viewType = viewType.LIST
			}
	}

	console.log(oldState)

	// fill caching
	if (oldState.viewType == viewType.TREE && !oldState.trees[oldState.selected]) {
		const d = oldState.root.getDrawableTreeFrom(oldState.selected)
		oldState.trees[oldState.selected] = d
	}

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
		/*
		const trees = rootDG.getZeroImportBy()
		.map(i => i.id)
		.reduce((o,n) => ({
			...o,
			[n] : rootDG.getDrawableTreeFrom(n),
		}), {root: rootDG})
		*/

		this.state = {
			viewType: viewType.SELECT_TREE,
			root: rootDG,
			trees: {root: rootDG},
			selected: "",
			useImportLevel: false,
			uniqueTreeExclude: [],
		}

		this.data = undefined
	}

	do(action) {
		this.state = reducer(this.state, action)
		this.drawState(this.state)
	}

	clickRoot() {
		this.state = reducer(this.state, {type: actionType.CLICK_ROOT})
		this.drawState(this.state)
	}

	clickId(id) {
		this.state = reducer(this.state, {type: actionType.CLICK_NODE, value: id})
		this.drawState(this.state)
	}

	clickFreeTree() {
		this.state = reducer(this.state, {type: actionType.CLICK_NOT_IMPORTED})
		this.drawState(this.state)
	}

	toggleTree() {
		this.state = reducer(this.state, {type: actionType.CLICK_TOGGLE_TREE})
		this.drawState(this.state)
	}

	search(keyword) {
		this.state = reducer(this.state, {type: actionType.SEARCH, value: keyword})
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
			case viewType.LIST:
				this.drawList(state)
		}
	}

	drawNode(state) {
		const data = state.root.getDrawableNode(state.selected)
		this.draw(data)
	}

	drawTree(state) {
		const data = state.trees[state.selected].getDrawable(false)
		this.draw(data)
	}

	drawSelectTree(state) {
		const data = Object.keys(state.trees).map((dg, i) => ({ id: dg, x: i, y: 1, color: 'steelblue' }))
		this.draw(data)
	}

	drawList(state) {
		const data = state.nodeList
		this.draw(data)
	}

}

const config = {
	container: {
		id: "#container",
		width: global.innerWidth - 20,
		height: global.innerHeight - 20 - 40
	},
	rect: {
		width: global.innerWidth / 11,
		height: global.innerHeight / 11, 
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

global.document.querySelector("#root").onclick = explorer.clickRoot.bind(explorer)
global.document.querySelector('#free_tree').onclick = explorer.clickFreeTree.bind(explorer)
global.document.querySelector('#tree_toggle').onclick = explorer.toggleTree.bind(explorer)
global.document.querySelector('#search').onchange = e => explorer.search(e.target.value)
