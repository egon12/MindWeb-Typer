import SVGPainter from './svg_painter'
import PositionCalculator from './position_calculator'

export default class DAG {

    convertToObj(c) {
        return c.split("\n").filter(i => i.length > 0).map(r => {
            let newr = r.split(" ")
            return {
                id: newr.shift(),
                link: newr
            }
        })
    }

    getZeroLevel(data) {
        return  [
          data.filter(i => i.link.length == 0).map(i => Object.assign({}, i, {y: 0})), 
          data.filter(i => i.link.length > 0)
        ]
    }

    linkIsIn(done_ids) {
        return obj => {
            if (obj.link.length > done_ids.length) return false
            for (i in obj.link)
                if (!done_ids.includes(obj.link[i])) return false
            return true
        }
    }

    getLevel(level, done, notyet) {
        newdone = notyet
            .filter(linkIsIn(done.map(i => i.id)))
            .map(i => Object.assign({}, i, {y: -1 * level}))
            .concat(done)
        
        newnotyet = notyet.filter(i => !newdone.map(i => i.id).includes(i.id))

        return [newdone, newnotyet]
    }

    setXByLevel(data, maxLevel) {
        for (let y=0; y > -1 * maxLevel; y--) {
            data.filter(n => n.y == -1 * y).forEach( (d, i) => d.x = i )
        }
        return data
    }

    process(content) {
        var done, notyet = this.convertToObj(content);
        [done, notyet] = this.getZeroLevel(notyet);
        if (done.length == 0) {
            console.log("There is no independent module")
                return []
        }
        let level = 1;
        let notyetLengthBefore = notyet.length
        while(notyet.length > 0 ) {
            [done, notyet] = this.getLevel(level, done, notyet);
            level++;
            if (notyetLengthBefore == notyet.length) {
                break; console.log("Cyclic on level " + level);
            }
        }

        return this.setXByLevel(done, level).map(i => Object.assign(i, {color : 'steelblue'}))
    }
}
