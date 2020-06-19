import { select } from "d3-selection";
import _d3 from "d3-transition";

export default class SVGPainter {
	init(config) {
		const cc = config.container;
		const base = select(cc.id);

		base.selectAll("svg").remove();

		const graph = base
			.append("svg")
			.attr("width", cc.width)
			.attr("height", cc.height)
			.style("border", "1px solid bold");

		this.graph = graph;
	}

	drawNodes(nodes, config) {
		this.drawRects(nodes, config);
		this.drawTexts(nodes, config);
	}

	drawEdges(edges, config) {
		const lines = this.graph
			.selectAll("path")
			.data(edges, i => i.from.id + i.to.id);

		lines
			.transition()
			.duration(300)
			.attr("d", this.makeD)
			.attr("stroke", c => c.stroke);

		lines
			.enter()
			.append("path")
			.attr("stroke", "white")
			.attr("stroke-width", "10")
			.attr("fill", "none")
			.attr("d", this.makeD)
			.transition()
			.duration(600)
			.attr("stroke", c => c.stroke);

		lines
			.exit()
			.transition()
			.duration(600)
			.attr("stroke", "white")
			.remove();
	}

	makeD(connection) {
		const c = connection.curve;
		return ["M", c.x1, c.y1, "C", c.x2, c.y2, c.x3, c.y3, c.x4, c.y4]
			.map(i => (isNaN(i) ? i : parseInt(i)))
			.join(" ");
	}

	drawRects(nodes, config) {
		const rects = this.graph.selectAll("rect").data(nodes, i => i.id);

		rects
			.transition()
			.duration(600)
			.attr("x", d => d.r_x)
			.attr("y", d => d.r_y)
			.attr("width", config.rect.width)
			.attr("height", config.rect.height)
			.attr("fill", d => d.color);

		// todo maybe try to delete attr, attr y and attr others?
		rects
			.enter()
			.append("rect")
			.attr("fill", "white")
			.attr("color", "white")
			.attr("x", d => d.r_x)
			.attr("y", d => d.r_y)
			.attr("width", config.rect.width)
			.attr("height", config.rect.height)

			.transition()
			.duration(600)
			.attr("fill", d => d.color);

		rects.exit().transition().duration(600).attr("fill", "white").remove();
	}

	drawTexts(nodes, config) {
		const texts = this.graph.selectAll("text").data(nodes, i => i.id);

		texts
			.text(d => d.id)
			.transition()
			.duration(600)
			.attr("x", d => d.r_x + config.rect.width / 2)
			.attr("y", d => d.r_y + config.rect.height / 2);

		// todo maybe try to delete attr, attr y and attr others?
		texts
			.enter()
			.append("text")
			.text(d => d.id)
			.attr("fill", "white")
			.attr("font-family", config.font.family)
			.attr("font-size", config.font.size)
			.attr("dominant-baseline", "central")
			.attr("text-anchor", "middle")
			.attr("x", d => d.r_x + config.rect.width / 2)
			.attr("y", d => d.r_y + config.rect.height / 2);

		texts.exit().transition().duration(600).remove();
	}
}
