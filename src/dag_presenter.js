import DAG from './dag'
import PositionCalculator from './position_calculator'
import SVGPainter from './svg_painter'

const config = {
    container: { id: '#container', width: 400, height: 300 },
    rect: { width: 100, height: 80 },
    font: { family: 'Cantarell', size: 14 }
}

const dag = new DAG()

const position = new PositionCalculator()

global.dagonload = function() {
    const painter = new SVGPainter(config)
    draw()
}

global.draw = function(content) {
    const data = dag.process("A\nB\nC")
    const nodes = position.calculateNodePosition(data, config)
    painter.drawNodes(nodes, config)
}

dagonload()
