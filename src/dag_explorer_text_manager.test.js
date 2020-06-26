import DagExplorerTextManager from "./dag_explorer_text_manager.js";

test("getRoot should get all content", () => {
	const content = "A B C\nB C\nC";

	const tm = new DagExplorerTextManager(content);

	expect(tm.getRoot()).toEqual(content);
});

test("getID should filter that have that id in dependencies", () => {
	const content = "A B C\nB C\nD C\nE F\nF B Z\nC\nZ";
	const expected = "B C\nA B\nF B\nC";

	const tm = new DagExplorerTextManager(content);

	expect(tm.getID("B")).toEqual(expected);
});

test.skip('can be group', () => {
	const input1 = 'a/b/c/d'
	const input2 = 'a/b/c/e'
	const input3 = 'a/b/c/f/g/h'
	const input4 = 'x/y/z'
	const input5 = 'x/y/y'
	const input6 = 'a/b/c/g/h'

	const tm = new DagExplorerTextManager('');

	expect(tm.canBeGroup(input1, input2)).toBe(true);
	expect(tm.canBeGroup(input1, input3)).toBe(true);
	expect(tm.canBeGroup(input2, input3)).toBe(true);
	expect(tm.canBeGroup(input6, input3)).toBe(true);
	
	expect(tm.canBeGroup(input1, input4)).toBe(false);
	expect(tm.canBeGroup(input1, input5)).toBe(false);


});

test('check is bounded', () => {
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

	const tm = new DagExplorerTextManager(content);
	expect(tm.isBounded('A', 'B')).toBe(true)
	expect(tm.isBounded('A', 'J')).toBe(true)
	expect(tm.isBounded('A', 'J', ['B'])).toBe(false)
	expect(tm.isBounded('A', 'G')).toBe(false)
	expect(tm.isBounded('A', 'I')).toBe(false)
})


test.skip('uniqe tree', () => {
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

	const tm = new DagExplorerTextManager(content);
	expect(tm.uniqueTree()).toEqual(['A|J', 'G'])
})


test('get edge of node', () => {
	const content = `
A B C D
B
C
D E F
E
F G
G
`

	const tm = new DagExplorerTextManager(content);

	expect(tm.getNodeNotImported().map(i => i.name)).toEqual(['A'])
	expect(tm.getFreeDependencies().map(i => i.name)).toEqual(['B', 'C', 'E', 'G'])
})
