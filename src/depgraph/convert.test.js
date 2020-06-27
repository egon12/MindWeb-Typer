import { DepGraph, Nodes, convert } from './convert'


test("convert should throw error when a node import to itself", () => {
	const content = "Base\nCommon Base\nAccount Common Account\n";

	expect(() => convert(content)).toThrow(
		'"Account" cannot import it self'
	);
});

test("convert should throw error when a node is missing", () => {
	const content =
		"Base\nCommon Base\nAccount Common\nPost Account\nComment Post1\n";

	expect(() => convert(content)).toThrow('Cannot find node "Post1"');
});

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

	expect(nodes.getZeroImportBy().map(i => i.name)).toEqual(['A'])
	expect(nodes.getZeroDependencies().map(i => i.name)).toEqual(['B', 'C', 'E', 'G'])
})

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



test.skip("normal operation", () => {
	const content =
		"Base\nCommon Base\nAccount Common\nMessage Account Common\nCall Account Common";

	const dg = convert(content);
	expect(r.find(i => i.id == "Base").y).toBe(0);
	expect(r.find(i => i.id == "Account").y).toBe(20);
	expect(r.find(i => i.id == "Message").x).toBe(1);
	expect(r.find(i => i.id == "Call").x).toBe(2);
});




test.skip("should have meta", () => {
	const content =
		"Base | meta1\nCommon Base | meta2\nAccount Common\nMessage Account Common\nCall Account Common";


	const r = convert(content);
	expect(r.find(i => i.id == "Base").meta).toBe("meta1");
	expect(r.find(i => i.id == "Common").meta).toBe("meta2");
});

test.skip("should have color", () => {
	const content =
		"Base | green\nCommon Base\nAccount Common | not_color \nMessage Account Common\nCall Account Common";


	const r = convert(content);
	expect(r.find(i => i.id == "Base").color).toBe("green");
	expect(r.find(i => i.id == "Common").color).toBe("steelblue");
	expect(r.find(i => i.id == "Account").color).toBe("steelblue");
});
