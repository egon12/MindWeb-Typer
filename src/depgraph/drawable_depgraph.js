import DepGraph from './depgraph'
import { calculate } from './pos_calculator'

export default class DrawableDepGraph extends DepGraph {

    getDrawable(useImport) {
        calculate(this, useImport)
        return Object.values(this.nodes).map(i => ({
            id: i.id,
            link: i.dependencies.map(j => j.id),
            x: i.x,
            y: i.y,
            color: 'steelblue',
        }))
    }

    getDrawableTrees(exclude) {
        const self = this
        const trees = this.uniqueTree()
        return Object.keys(trees).reduce((o, id) => ({
            ...o,
            [id]: recreate(self, trees[id]),
        }), {'root': self})
    }

    getDrawableNode(id) {
        const node = this.get(id)

        const maxX = Math.max(node.dependencies.length, node.importBy.length)

        const ds = simpleLinkDrawable(node.dependencies, id, 0, maxX)
        const ib = simpleLinkDrawable(node.importBy, id, 200, maxX)
        const all = ds.concat(ib)

        all.push({
            id: node.id,
            link: [id],
            color: 'steelblue',
            x: (maxX + 1) / 2,
            y: 100,
        })

        return all
    }
}

function simpleLinkDrawable(nodes, linkId, y, maxX) {
	const mtpl = (maxX + 1) /  (nodes.length + 1)
	return nodes.map((n, i) => ({
		id: n.id,
		link: [linkId],
		color: 'steelblue',
		y,
		x: (i + 1) * mtpl
	}))
}

export function recreate(oldDG, nodes) {
    let newNodes = nodes.reduce((a, n) => ({...a, [n.id]: {...n}}), {})

    // add missing node
    Object.values(newNodes).forEach(n => {
        n.dependencies.forEach(m => {
            if (newNodes[m.id]) {
                return
            }
            const oldNode = oldDG.get(m.id)
            newNodes[m.id] = { ...oldNode }
        })
        n.importBy.forEach(m => {
            if (newNodes[m.id]) {
                return
            }
            const oldNode = oldDG.get(m.id)
            newNodes[m.id] = { ...oldNode }
        })
    })


    Object.values(newNodes).forEach(n => { 
        n.dependencies = n.dependencies.map(i => newNodes[i.id]).filter(i => i)
        n.importBy = n.importBy.map(i => newNodes[i.id]).filter(i => i)
    })

    return new DrawableDepGraph(newNodes)
}