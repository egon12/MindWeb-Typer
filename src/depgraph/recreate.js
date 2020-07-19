import DepGraph from './depgraph'

// recreate will create new depgraph
// with new node,
// and with new excluded ones
// the excluded ones wouldn't have 
// but how about the missing one?
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

    return new DepGraph(newNodes)
}