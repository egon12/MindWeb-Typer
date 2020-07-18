import { convert } from './convert'
import DepGraph from './depgraph'

test("Create Dep Graph", () => {
	const content = `
A
B C A
C A
`
	const nodesObj = convert(content)

	const dg = new DepGraph(nodesObj)

	expect(dg.get('A').dependencyLevel).toBe(0)
	expect(dg.get('B').dependencyLevel).toBe(2)
	expect(dg.get('C').dependencyLevel).toBe(1)

});


test("Create Dep Graph 2", () => {
	const content =
		"Base\nCommon Base\nAccount Common\nMessage Account Common\nCall Account Common";

	const nodes = convert(content);
	const dg = new DepGraph(nodes)

	expect(dg.get("Base").dependencyLevel).toBe(0);
	expect(dg.get("Common").dependencyLevel).toBe(1);
	expect(dg.get("Account").dependencyLevel).toBe(2);
	expect(dg.get("Message").dependencyLevel).toBe(3);
	expect(dg.get("Call").dependencyLevel).toBe(3);
});



test("Create DepGraph should be error when nodes have no end", () => {

	const content = `
Base
Common Base
Account Common Comment
Post Account
Comment Post
`
	const nodesObj = convert(content)

	expect(() => new DepGraph(nodesObj)).toThrow(
		"DepGraph should be acyclic. Cannot find the end of Graph"
	);
});

test("Create DepGraph should be error when nodes have cyclic dependencies", () => {

	const content = `
Base
Common Base
Account Common Comment
Post Account
Comment Post
End Common
`
	const nodesObj = convert(content)

	expect(() => new DepGraph(nodesObj)).toThrow(
		"Cyclic on Account -> Post -> Comment -> Account"
	);
});



test("Create DepGraph should be error when have cyclic dependencies ", () => {

	const content = `
Base
Common Base
Account Common Comment
Post Account
Comment Post
`
	const nodesObj = convert(content)

	expect(() => new DepGraph(nodesObj)).toThrow(
		"DepGraph should be acyclic. Cannot find the end of Graph"
	);
});

test('DepGraph should able to check is one node bounded (have connection) to another node', () => {
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

	expect(dg.isBounded('A', 'B')).toBe(true)
	expect(dg.isBounded('A', 'J')).toBe(true)
	expect(dg.isBounded('A', 'J', ['B'])).toBe(false)
	expect(dg.isBounded('A', 'G')).toBe(false)
	expect(dg.isBounded('A', 'I')).toBe(false)
})

test('DepGraph should able to seperate between to free tree', () => {
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

	expect(dg.uniqueTree()).toEqual(['A', 'G'])
})


test.skip('DepGraph should able to seperate between to free tree and make it flat', () => {
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

	expect(trees[0].map(i => i.id)).toEqual(['B', 'A', 'D', 'J', 'C', 'E', 'F'])
})
