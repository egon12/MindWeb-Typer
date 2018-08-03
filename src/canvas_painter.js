import {select} from 'd3-selection'

import {timer} from 'd3-timer'

import SVGPainter from './svg_painter.js'

export default class CanvasPainter extends SVGPainter{

    init(config) {
        const cc = config.container
        const base = select(cc.id)

        base.selectAll('canvas').remove();

        this.canvas = base.append('canvas')
            .attr('width', cc.width)
            .attr('height', cc.height)
            .style('border', '1px solid bold')

        this.graph = this.canvas.append('fake-svg')

        this.ctx = this.canvas.node().getContext('2d')

        this.config = config
        timer(this.drawInCanvas.bind(this))

    }

    drawNodes(nodes, config) {
        super.drawNodes(nodes, config)
        this.config = config
        this.drawNodesInCanvas()
    }


    drawEdges(edges, config) {
        super.drawEdges(edges, config)
        this.config = config
        this.drawEdgesInCanvas()
    }

    drawInCanvas() {
        this.ctx.clearRect(0, 0, this.config.container.width, this.config.container.height);
        this.drawEdgesInCanvas()
        this.drawNodesInCanvas()
    }

    drawNodesInCanvas() {

        const cc = this.config.container
        const config = this.config

        const rects = this.graph.selectAll('rect')
        const ctx = this.ctx

        ctx.font = config.font.size + "px " + config.font.family;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        rects.each(function(d, i) {

            var el = select(this);

            var x = Number(el.attr('x'));
            var y = Number(el.attr('y'));

            ctx.fillStyle = el.attr('fill');
            ctx.fillRect(x, y, config.rect.width, config.rect.height);

            ctx.fillStyle = el.attr('color');
            var text;
            if (d.name !== undefined && d.name !== '') {
                text = d.name.trim();
            } else {
                text = d.id.trim();
            }
            ctx.fillText(text, x + config.rect.width/2, y + config.rect.height/2);

        });

    }

    drawEdgesInCanvas() {
        const paths = this.graph.selectAll('path')
        const ctx = this.ctx
        const config = this.config

        ctx.lineWidth = '4';
        paths.each(function(d, i) {

            const el = select(this)

            const pathDetail = el.attr('d')

            const coord = pathDetail.split(' ')

            if (coord.length != 10) throw "Edges doesn't have berzier curve"
            
            const [M, x1, y1, C, x2, y2, x3, y3, x4, y4] = coord.map(i => parseInt(i))

            ctx.strokeStyle = d.stroke
            ctx.beginPath()
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
            ctx.stroke();

            /*
            if (el.attr('text') !== '') {
                ctx.fillStyle = 'black';
                ctx.fillText(el.attr('text'), x1 + ((x4-x1)/2), y1 + ((y4-y1)/2) - config.font.size );
            }
            */

        })
    }
}
