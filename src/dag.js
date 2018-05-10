const MAX_LEVEL = 50

export default class DAG {

    convertToObj(c) {
        if (!c) return []
        
        return c.split("\n").filter(i => i.length > 0).map(r => {
            let newr = r.split(" ")
            return {
                id: newr.shift(),
                link: newr.filter(i => i.length > 0)
            }
        })
    }

    getZeroLevel(data) {
        const done = data.filter(i => i.link.length == 0).map(i => Object.assign({}, i, {y: 0}))
        if (done.length == 0) throw ("There is no independent module")
        const notyet = data.filter(i => i.link.length > 0)
        return  [done, notyet]
    }

    linkIsIn(done_ids) {
        return obj => {
            if (obj.link.length > done_ids.length) return false
            for (let i in obj.link)
                if (!done_ids.includes(obj.link[i])) return false
            return true
        }
    }

    getLevel(level, done, notyet) {
        const newdone = notyet
            .filter(this.linkIsIn(done.map(i => i.id)))
            .map(i => Object.assign({}, i, {y: -1 * level}))
            .concat(done)
        
        const newnotyet = notyet.filter(i => !newdone.map(i => i.id).includes(i.id))

        if (notyet.length == newnotyet.length) throw "Possible cyclic link in " + notyet.map(i=>i.id).join(", ")

        return [newdone, newnotyet]
    }

    checkLinkToItSelf(data) {
        data.forEach(i => {
            if (i.link.includes(i.id)) {
                throw i.id + " cannot link to it self"
            }
        })
    }

    checkLinkToNotFound(data) {
        const all_ids = data.map(i => i.id)
        data.forEach( d => d.link.forEach( l => {
            if (!all_ids.includes(l)) {
                throw "Cannot find link to " + l
            }
        }))
    }


    setXByLevel(data, maxLevel) {
        for (let y=0; y > -1 * maxLevel; y--) {
            data.filter(n => n.y == y).forEach( (d, i) => d.x = i )
        }
        return data
    }

    process(content) {
        var rawdata = this.convertToObj(content);
        if (rawdata.length == 0) {
            return []
        }

        this.checkLinkToItSelf(rawdata)

        this.checkLinkToNotFound(rawdata)

        var [done, notyet] = this.getZeroLevel(rawdata);

        let level = 1;
        while(notyet.length > 0 && level < MAX_LEVEL) {
            [done, notyet] = this.getLevel(level, done, notyet);
            level++;
        }

        return this.setXByLevel(done, level).map(i => Object.assign(i, {color : 'steelblue'}))
    }
}
