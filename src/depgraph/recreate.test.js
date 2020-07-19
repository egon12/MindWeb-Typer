import { recreate } from './recreate'
import DepGraph from './depgraph'
import { convert } from './convert'

test('recreate', () => {
	const content = `
B
A B C D
D E F
G H I
J B
C
H
I
E
F
`
	const nodesObj = convert(content)

	const dg =  new DepGraph(nodesObj)
    const trees = dg.uniqueTreeObject()
    
    const newDG0 = recreate(dg, trees[0], [])
    const newDG1 = recreate(dg, trees[1], [])

	expect(Object.keys(newDG0.nodes).sort()).toEqual(['B', 'A', 'D', 'J', 'C', 'E', 'F'].sort())
	expect(Object.keys(newDG1.nodes).sort()).toEqual(['G', 'H', 'I'].sort())
})


test('something', () => {
	const content = `
B
A B C D
D E F
G H I
J B
C
H
I
E
F
`
	const nodesObj = convert(content)

	const dg =  new DepGraph(nodesObj)
    const trees = dg.uniqueTreeObject()
    
    const newDG = recreate(dg, trees[0], [])

	expect(Object.keys(newDG.nodes).sort()).toEqual(['B', 'A', 'D', 'J', 'C', 'E', 'F'].sort())
})

test('recreate with exclude', () => {
	const content = `
B
A B C D
D E F
G H I
J B
C
H
I
E
F
`
	const nodesObj = convert(content)

	const dg =  new DepGraph(nodesObj)
    const trees = dg.uniqueTreeObject(['B'])
    
    const newDG0 = recreate(dg, trees[0], [])
    const newDG1 = recreate(dg, trees[1], [])
    const newDG2 = recreate(dg, trees[2], [])

	expect(Object.keys(newDG0.nodes).sort()).toEqual(['B', 'A', 'D', 'C', 'E', 'F'].sort())
	expect(Object.keys(newDG1.nodes).sort()).toEqual(['G', 'H', 'I'].sort())
	expect(Object.keys(newDG2.nodes).sort()).toEqual(['B', 'J'].sort())
})

test('recreate with exclude check connection', () => {
	const content = `
B
A B C D
D E F
G H I
J B
C
H
I
E
F
`
	const nodesObj = convert(content)

	const dg =  new DepGraph(nodesObj)
	const trees = dg.uniqueTreeObject(['B'])
	const eb = dg.get('B')
    
    const newDG0 = recreate(dg, trees[0], [eb])
    const newDG1 = recreate(dg, trees[1], [eb])
	const newDG2 = recreate(dg, trees[2], [eb])
	

	const theJ = newDG2.get('J')
	const theB = newDG2.get('B')

	expect(theJ.dependencies[0]).toBe(theB)
	expect(theB.importBy[0]).toBe(theJ)

	expect(Object.keys(newDG0.nodes).sort()).toEqual(['B', 'A', 'D', 'C', 'E', 'F'].sort())
	expect(Object.keys(newDG1.nodes).sort()).toEqual(['G', 'H', 'I'].sort())
	expect(Object.keys(newDG2.nodes).sort()).toEqual(['B', 'J'].sort())
})


test('recreate with exclude check connection w in J', () => {
	const content = `
B
A B C D
D E F
G H I
J B L
C
H
I
E
F
L
`
	const nodesObj = convert(content)

	const dg =  new DepGraph(nodesObj)
	const trees = dg.uniqueTreeObject(['B'])
	const eb = dg.get('B')
    
    const newDG0 = recreate(dg, trees[0], [eb])
    const newDG1 = recreate(dg, trees[1], [eb])
	const newDG2 = recreate(dg, trees[2], [eb])
	

	const theJ = newDG2.get('J')
	const theB = newDG2.get('B')
	const theL = newDG2.get('L')

	expect(theJ.dependencies[0]).toBe(theB)
	expect(theJ.dependencies[1]).toBe(theL)
	expect(theB.importBy[0]).toBe(theJ)

	expect(Object.keys(newDG0.nodes).sort()).toEqual(['B', 'A', 'D', 'C', 'E', 'F'].sort())
	expect(Object.keys(newDG1.nodes).sort()).toEqual(['G', 'H', 'I'].sort())
	expect(Object.keys(newDG2.nodes).sort()).toEqual(['B', 'J', 'L'].sort())
})