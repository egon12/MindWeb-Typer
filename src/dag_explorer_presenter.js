import DAG from "./dag";
import PositionCalculator from "./position_calculator";
import SVGPainter from "./interactive_svg_painter";
import DagExplorerTextManager from "./dag_explorer_text_manager";

class DagExplorer {
	constructor(content, config) {
		this.config = config;
		this.dag = new DAG();
		this.position = new PositionCalculator();
		this.painter = new SVGPainter();
		this.painter.init(config);

		this.text = new DagExplorerTextManager(content);

		this.draw = this.draw.bind(this);
		this.painter.onclick = this.clickId.bind(this);
	}

	clickRoot() {
		const content = this.text.getRoot();
		this.draw(content);
	}

	clickId(id) {
		const content = this.text.getID(id);
		this.draw(content);
	}

	draw(content) {
		const data = this.dag.process(content);
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
	font: {
		family: "Helvetica",
		size: 14
	}
};

const explorer = new DagExplorer(global.dag_content, config);
explorer.clickRoot();
global.document.querySelector("#reset").onclick = () => explorer.clickRoot();
