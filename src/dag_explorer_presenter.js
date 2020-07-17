import PositionCalculator from "./position_calculator";
import SVGPainter from "./interactive_svg_painter";
import { convertToDepGraph, toDrawableData, toThreeLevel } from './depgraph/convert'
import { calculate } from './depgraph/pos_calculator'

class DagExplorer {
	constructor(content, config) {
		this.config = config;
		this.position = new PositionCalculator();
		this.painter = new SVGPainter();
		this.painter.init(config);


		this.draw = this.draw.bind(this);
		this.painter.onclick = this.clickId.bind(this);

		this.rootDG = convertToDepGraph(content)
	}

	clickRoot() {
		calculate(this.rootDG)
		this.draw(toDrawableData(this.rootDG))
	}

	clickId(id) {
		const all = toThreeLevel(this.rootDG, id)
		this.draw(all)
	}

	draw(data) {
		const nodes = this.position.calculateNodePosition(data, this.config);
		const edges = this.position.calculateEdgePoints(nodes, this.config);
		this.painter.drawEdges(edges, this.config);
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
