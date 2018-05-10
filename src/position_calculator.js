export default class PositionCalculator {

    calculateNodePosition(data, config) {
        const scale = this.createScale(data, config)
        const dataWithPosition = this.createPosition(data, scale)
        return dataWithPosition
    }

    calculateEdgePoints(dataWithPosition, config) {
        const map = this.createMap(dataWithPosition)
        const edges = this.createConnections(dataWithPosition, map, config)
        return edges
    }

    createMap(data) {
        return data.reduce( (t,i) => Object.assign(t, {[i.id]: i}), {})
    }

    minMax(data) {
        return [Math.min(...data), Math.max(...data)]
    }

    createLinearScale(rangeFrom, rangeTo, domainFrom, domainTo) {

        const multiplier = (parseFloat(rangeTo) - parseFloat(rangeFrom)) / 
            (parseFloat(domainTo) - parseFloat(domainFrom))

        return domain => {
            if (domain < domainFrom) return rangeFrom
            else if (domain > domainTo) return rangeTo
            else return rangeFrom + (domain - domainFrom) * multiplier
        }
    }

    createScale(data, config) {

        const allX = data.map(i => i.x)
        const allY = data.map(i => i.y)

        var [minX, maxX] = this.minMax(allX)
        var [minY, maxY] = this.minMax(allY)

        if (minX == maxX) {
            minX -= 1
            maxX += 1
        }

        if (minY == maxY) {
            minY -= 1
            maxY += 1
        }


        return {
            x : this.createLinearScale(0, config.container.width - config.rect.width, minX, maxX),
            y : this.createLinearScale(0, config.container.height - config.rect.height, minY, maxY)
        }

    }

    createPosition(data, scale) {
        return data.map(i => Object.assign({}, i, {r_x: scale.x(i.x), r_y: scale.y(i.y)}))
    }

    createConnections(data, map, config) {

        var connections = []

        for (const i in data) {
            const from = data[i]
            for (const j in from.link) {

                const link = from.link[j]

                const to = (typeof link === 'string' || link instanceof String) ? map[link] : map[link.id]

                const color = (link.color === undefined || link.color === '') ?  from.color :  link.color

                const text = (link.text === undefined) ? '' : link.text

                const side = this.calculateSide(link, from, to)

                const curve = this.createBezierCurve(from, to, side, config)

                connections.push({
                    from,
                    to,
                    text,
                    stroke: color,
                    side,
                    curve
                })
            }
        }

        return connections
    }


    calculateSide(link, nodeFrom, nodeTo) {

        var from, to

        if (link.from_side === undefined && link.to_side === undefined) {
            var hor = nodeTo.x - nodeFrom.x
            var ver = nodeTo.y - nodeFrom.y

            if (Math.abs(hor) > Math.abs(ver)) {
                if (hor > 0) [from, to] =  ['right', 'left']
                else [from, to] = ['left', 'right']
            } else {
                if (ver > 0) [from, to] = ['bottom', 'top']
                else [from, to] = ['top', 'bottom']
            }

        } else if (link.from_side !== undefined && link.to_side !== undefined) {
            [from, to] = [link.from_side, link.to_side]
        }

        return { from, to }
    }


    createBezierCurve(from, to, side, config) {

        if (from.r_x == undefined || from.r_y == undefined || to.r_x == undefined || to.r_y == undefined) {
            throw Error("Calculate Node Position first")
        }

        var [x1, y1] = this.offset(side.from, from.r_x, from.r_y, config)
        var [x4, y4] = this.offset(side.to, to.r_x, to.r_y, config)
        var x2, y2, x3, y3

        switch(side.from) {
            case 'top': 
            case 'bottom': 
                x2 = x1
                y2 = (y1 + y4)/2
                break
            case 'left': 
            case 'right': 
                y2 = y1
                x2 = (x1+x4)/2
                break
        }

        switch(side.to) {
            case 'top': 
            case 'bottom': 
                x3 = x4
                y3 = (y1 + y4)/2
                break
            case 'left': 
            case 'right': 
                y3 = y4
                x3 = (x1+x4)/2
                break
        }

        return {x1, y1, x2, y2, x3, y3, x4, y4}
    }


    offset(side, x, y, config) {

        const width = config.rect.width
        const height = config.rect.height

        switch(side) {
            case 'top': return [x + width/2, y]
            case 'bottom': return [x + width/2, y + height]
            case 'left': return [x, y + height/2]
            case 'right': return [x + width, y + height/2]
        }
    }



}
