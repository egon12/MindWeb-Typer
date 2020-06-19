import DAG from "./dag";
import PositionCalculator from "./position_calculator";
import SVGPainter from "./svg_painter";

global.config = {
	container: { id: "#container", width: 400, height: 300 },
	rect: { width: 100, height: 40 },
	font: { family: "Helvetica", size: 14 }
};

const dag = new DAG();

const position = new PositionCalculator();

let painter;

global.graphInit = function () {
	painter = new SVGPainter();
	painter.init(global.config);
};

global.graphDraw = function (content) {
	try {
		const data = dag.process(content);
		const nodes = position.calculateNodePosition(data, config);

		const edges = position.calculateEdgePoints(nodes, config);

		painter.drawEdges(edges, global.config);

		painter.drawNodes(nodes, global.config);
	} catch (e) {
		console.error(e);
		global.alert(e);
	}
};
