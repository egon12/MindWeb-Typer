import mindmap from './mindmap_processor'
import PositionCalculator from './position_calculator'
import CanvasPainter from './canvas_painter'

import * as d3 from 'd3-selection'

global.d3 = d3

let config = {
  container: { id: '#container', width: 400, height: 300 },
  rect: { width: 100, height: 40 },
  font: { family: 'Helvetica', size: 14 }
}

const position = new PositionCalculator()

let painter;

const graphInit = function() {
  painter = new CanvasPainter()
  painter.init(config)
}

const graphDraw = function(content) {
  try {
    const data = mindmap(content)

    const nodes = position.calculateNodePosition(data, config)

    const edges = position.calculateEdgePoints(nodes, config)

    painter.drawEdges(edges, config)

    painter.drawNodes(nodes, config)


  } catch (e) {
    console.error(e)
    global.alert(e)
  }
}

global.initInput = function(inputContent, inputSettings) {

  function processInput() {
    graphDraw(inputContent.value)
  }

  inputContent.onkeydown = function(e) {
    if (e.keyCode == 13) {
      processInput();
    }
  };

  inputContent.onchange = processInput;

  if (inputSettings.value == "") {
    inputSettings.value = JSON.stringify(config, null, 2)
  } else {
    try {
      config = JSON.parse(inputSettings.value)
    } catch(e) {
      alert(e)
    }
  }

  inputSettings.onchange = function(e) {
    try {
      config = JSON.parse(inputSettings.value)
      graphInit()
      graphDraw(inputContent.value)
    } catch(e) {
      alert(e)
    }
  }

  graphInit()

}
