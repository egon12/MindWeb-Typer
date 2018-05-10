import DAG from './dag'
import PositionCalculator from './position_calculator'
import SVGPainter from './svg_painter'

const config = {
    container: { id: '#container', width: 400, height: 300 },
    rect: { width: 100, height: 40 },
    font: { family: 'Helvetica', size: 14 }
}

const dag = new DAG()

const position = new PositionCalculator()

let painter;

global.dagonload = function() {
    painter = new SVGPainter(config)
    mydraw("")
}

global.mydraw = function(content) {
    try {
        const data = dag.process(content)
        const nodes = position.calculateNodePosition(data, config)

        const edges = position.calculateEdgePoints(nodes, config)

        painter.drawEdges(edges)

        painter.drawNodes(nodes, config)


    } catch (e) {
        global.alert(e)

    }
}

console.log(global)

dagonload()
