import DagExplorerTextManager from './dag_explorer_text_manager.js'

test('getRoot should get all content', () => {
	const content = "A B C\nB C"

	const tm = new DagExplorerTextManager(content)

	expect(tm.getRoot()).toEqual(content)
})

test('getID should filter that have that id in dependencies', () => {
	const content = "A B C\nB C\nD C\nE F\nF B Z"
	const expected = "A B\nB C\nF B"

	const tm = new DagExplorerTextManager(content)

	expect(tm.getID("B")).toEqual(expected)
})
