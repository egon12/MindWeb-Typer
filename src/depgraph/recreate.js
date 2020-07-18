import DepGraph from './depgraph'

// recreate will create new depgraph
// with new node,
// and with new excluded ones
// the excluded ones wouldn't have 
// but how about the missing one?
export function recreate(oldDG, nodes, excludedNodes) {
    let newNodes = nodes.reduce((a, n) => ({...a, [n.id]: {...n}}), {})

    // add missing node
    Object.values(newNodes).forEach(n => {
        n.dependencies.forEach(m => {
            if (newNodes[m.id]) {
                return
            }
            if (excludedNodes.find(en => en.id == m.id)) {
                return
            }
            const oldNode = oldDG.get(m.id)
            newNodes[m.id] = { ...oldNode }
        })
        n.importBy.forEach(m => {
            if (newNodes[m.id]) {
                return
            }
            if (excludedNodes.find(en => en.id == m.id)) {
                return
            }
            const oldNode = oldDG.get(m.id)
            newNodes[m.id] = { ...oldNode }
        })
    })

    // include excluded nodes
    let newExcludedNodes = excludedNodes.map(n => ({
        id: n.id,
        dependencies: [],
        importBy: [],
    }))

    // fill new excluded nodes
    Object.values(newNodes).forEach(n => {
        n.dependencies.forEach(m => {
            const en = newExcludedNodes.find(e => e.id = m.id)
            if (en) {
                en.importBy.push(n)
            }
        })

        n.importBy.forEach(m => {
            const en = newExcludedNodes.find(e => e.id = m.id)
            if (en) {
                en.dependencies.push(n)
            }
        })
    })

    Object.values(newNodes).forEach(n => { 
        n.dependencies = n.dependencies.map(i => newNodes[i.id]).filter(i => i)
        n.importBy = n.importBy.map(i => newNodes[i.id]).filter(i => i)
    })

    const allNodes = newExcludedNodes.reduce((o, n) => ({...o, [n.id]: n}), newNodes)

    return new DepGraph(allNodes)
}

function nodesToNodes(nodes) {
    return nodes.reduce((a, n) => a[n.id] = n)
}