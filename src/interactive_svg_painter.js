import { select } from "d3-selection";
import _d3 from "d3-transition";

export default class SVGPainter {
	init(config) {
		const cc = config.container;
		const base = select(cc.id);

		base.selectAll('svg').remove();

		const graph = base
			.append('svg')
			.attr('width', cc.width)
			.attr('height', cc.height)
			.style('border', '1px solid bold');

		this.graph = graph;
		this.lines = graph.append('g');
		this.nodes = graph.append('g');
		this.onclick =
			typeof config.onclick == 'function' ? config.onclick : () => {};
	}

	drawNodes(nodes, config) {
		this.drawRects(nodes, config);
		this.drawTexts(nodes, config);
		this.drawExpandToggle(nodes, config);
	}

	drawEdges(edges, config) {
		const lines = this.lines
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
			.attr("fill", "none")
			.attr("stroke", c => c.stroke)
			.attr("stroke-width", "10")
			.attr("stroke-opacity", "0.0")
			.attr("d", this.makeD)
			.transition()
			.duration(600)
			.attr("stroke-opacity", "1.0");

		lines
			.exit()
			.transition()
			.duration(600)
			.attr("stroke-opacity", "0.0")
			.remove();
	}

	makeD(connection) {
		const c = connection.curve;
		return ["M", c.x1, c.y1, "C", c.x2, c.y2, c.x3, c.y3, c.x4, c.y4]
			.map(i => (isNaN(i) ? i : parseInt(i)))
			.join(" ");
	}

	drawRects(nodes, config) {
		const rects = this.nodes.selectAll("rect").data(nodes, i => i.id);
		const onclick = this.onclick;

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
			.attr("fill", d => d.color)
			.attr("fill-opacity", "0.0")
			.attr("color", "none")
			.attr("x", d => d.r_x)
			.attr("y", d => d.r_y)
			.attr("width", config.rect.width)
			.attr("height", config.rect.height)
			.on("click", d => onclick(d.id))

			.transition()
			.duration(600)
			.attr("fill-opacity", "1.0");

		rects
			.exit()
			.transition()
			.duration(600)
			.attr("fill-opacity", "0.0")
			.remove();
	}

	drawTexts(nodes, config) {
		const texts = this.nodes.selectAll("g.text").data(nodes, i => i.id);
		const onclick = this.onclick;

		texts
			.transition()
			.duration(600)
			.attr("transform", d => "translate(" +(d.r_x+config.rect.width/2)+ " " +(d.r_y+config.rect.height/2)+ ")")

		// todo maybe try to delete attr, attr y and attr others?
		const textNode = texts
			.enter()
			.append("g")
			.attr("class", "text")
			.attr("transform", d => "translate(" +(d.r_x+config.rect.width / 2)+ " " +(d.r_y+config.rect.height / 2)+ ")")
			.on("click", d => onclick(d.id));

		textNode
			.append("text")
			.attr("class", "l1")
			.attr("text-anchor", "middle")
			.attr("fill", "lightgrey")
			.attr("font-family", config.font.family)
			.attr("font-size", config.font.size)
			.attr("dy", "-1.5em")
			.text(d => this.splitText(d.id, 0));

		textNode
			.append("text")
			.attr("class", "l2")
			.attr("text-anchor", "middle")
			.attr("fill", "lightgrey")
			.attr("font-family", config.font.family)
			.attr("font-size", config.font.size)
			.attr("dy", "0")
			.text(d => this.splitText(d.id, 1));

		textNode
			.append("text")
			.attr("class", "l3")
			.attr("text-anchor", "middle")
			.attr("fill", "lightgrey")
			.attr("font-family", config.font.family)
			.attr("font-size", config.font.size)
			.attr("dy", "1.5em")
			.text(d => this.splitText(d.id, 2));

		texts.exit().transition().duration(600).remove();
	}

	splitText(text, index) {
		const l = text.split('/')
		if (index == 0 && l.length > 3) {
			return text.split('/').splice(0,3).join('/')
		} else if (index == 1 && l.length > 3) {
			return '/' + text.split('/').splice(3, 6).join('/')
		} else if (index == 2 && l.length > 6) {
			return '/' + text.split('/').splice(6).join('/')
		} else if (index == 1 && l.length <= 3) {
			return text
		}
	}

	drawExpandToggle(nodes, config) {
		const circle = this.nodes.selectAll("circle").data(
			nodes.filter(n => n.isGroup),
			i => i.id
		);
		const onclick = this.onclick;

		circle
			.transition()
			.duration(600)
			.attr("cx", d => config.rect.width + d.r_x)
			.attr("cy", d => d.r_y)
			.attr("r", config.expandToggle.radius);

		// todo maybe try to delete attr, attr y and attr others?
		circle
			.enter()
			.append("circle")
			.attr("fill", "mediumvioletred")
			.attr("cx", d => config.rect.width + d.r_x)
			.attr("cy", d => d.r_y)
			.attr("r", config.expandToggle.radius)
			.attr("fill-opacity", "0.0")
			.on("click", d => onclick(d.id))

			.transition()
			.duration(600)
			.attr("fill-opacity", "1.0");

		circle
			.exit()
			.transition()
			.duration(600)
			.attr("fill-opacity", "0")
			.remove();
	}
}
