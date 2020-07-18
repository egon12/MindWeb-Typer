import PositionCalculator from "./position_calculator";
import SVGPainter from "./interactive_svg_painter";
import { convertToDepGraph, toDrawableData, toThreeLevel } from './depgraph/convert'
import { calculate } from './depgraph/pos_calculator'
import { recreate } from './depgraph/recreate'

class DagExplorer {
	constructor(content, config) {
		this.config = config;
		this.position = new PositionCalculator();
		this.painter = new SVGPainter();
		this.painter.init(config);


		this.draw = this.draw.bind(this);
		this.painter.onclick = this.clickId.bind(this);

		this.rootDG = convertToDepGraph(content)
		this.dgs = []
	}

	clickRoot() {
		const ex = getExclude()
		const exNode = this.rootDG.filter(i => ex.find(j => j ==i.id))
		this.dgs = this.rootDG.uniqueTreeObject(ex).map(n => recreate(this.rootDG, n, exNode))
		if (this.dgs.length > 1) {
			return this.drawTrees(this.dgs)
		}
		calculate(this.rootDG)
		this.draw(toDrawableData(this.rootDG))
	}

	clickId(id) {
		if (id.indexOf('tree-') == 0) {
			const theDG = this.dgs.find(dg => 'tree-' + dg.getZeroImportBy()[0].id == id)
			calculate(theDG)
			this.draw(toDrawableData(theDG))
			return
		}
		const all = toThreeLevel(this.rootDG, id)
		this.draw(all)
	}

	draw(data) {
		const nodes = this.position.calculateNodePosition(data, this.config);
		const edges = this.position.calculateEdgePoints(nodes, this.config);
		this.painter.drawEdges(edges, this.config);
		this.painter.drawNodes(nodes, this.config);
	}

	drawTrees(dgs) {
		const data = dgs.map((dg, i) => {
			console.log(dg)
			return {
				id: 'tree-' + dg.getZeroImportBy()[0].id,
				x: i,
				y: 1,
				color: 'steelblue'

			}
		})
		const nodes = this.position.calculateNodePosition(data, this.config);
		this.painter.drawNodes(nodes, this.config);
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
explorer.clickRoot();
global.document.querySelector("#reset").onclick = () => explorer.clickRoot();

function getExclude() {
	return global.document.querySelector("#exclude").value.split(" ").filter(i => i)
}

global.getExclude = getExclude