import SVGPainter from './svg_painter'

test('test svg_painter', () => {

    const config = { 
        container : { id: 'graph', width: 400, height: 300 },
        rect: { width: 100, height: 80 }
    }

    const p = new SVGPainter(config)

    const nodes = [
        { r_x: 200, r_y : 150, color: 'steelblue' }
    ]

    p.drawNodes(nodes)


})
