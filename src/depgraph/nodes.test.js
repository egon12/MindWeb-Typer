import { convert } from './convert'
import Nodes from './nodes'

test('nodes should able to get most free, and the most bounded (not imported)', () => {
	const content = `
A B C D
B
C
D E F
E
F G
G
`

	const nodesObj = convert(content)
	const nodes = new Nodes(nodesObj)

	expect(nodes.getZeroImportBy().map(i => i.id)).toEqual(['A'])
	expect(nodes.getZeroDependencies().map(i => i.id)).toEqual(['B', 'C', 'E', 'G'])
})
