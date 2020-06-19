import treeMiddleware from "./tree_middleware";

test("Should create tree from indented string", () => {
	var expected = {
		id: "Root",
		children: [
			{
				id: "RootChild1",
				parentId: "Root",
				children: [
					{
						id: "ChildFrom1_1",
						parentId: "RootChild1",
						children: []
					},
					{
						id: "ChildFrom1_2",
						parentId: "RootChild1",
						children: []
					},
					{ id: "ChildFrom1_3", parentId: "RootChild1", children: [] }
				]
			},
			{
				id: "RootChild2",
				parentId: "Root",
				children: [
					{
						id: "ChildFrom2_1",
						parentId: "RootChild2",
						children: []
					},
					{
						id: "ChildFrom2_2",
						parentId: "RootChild2",
						children: []
					},
					{ id: "ChildFrom2_3", parentId: "RootChild2", children: [] }
				]
			}
		]
	};

	const input = `
Root
 RootChild1
  ChildFrom1_1
  ChildFrom1_2
  ChildFrom1_3
 RootChild2
  ChildFrom2_1
  ChildFrom2_2
  ChildFrom2_3
`;
	expect(treeMiddleware(input)).toEqual(expected);
});

test("Should not failed this one", () => {
	var expected = {
		id: "Self",
		children: [
			{ id: "Work", parentId: "Self", children: [] },
			{
				id: "Family",
				parentId: "Self",
				children: [{ id: "Child", parentId: "Family", children: [] }]
			},
			{
				id: "Learn",
				parentId: "Self",
				children: [{ id: "WebRTC", parentId: "Learn", children: [] }]
			}
		]
	};

	const input = `
Self
 Work
 Family
  Child

 Learn
  WebRTC
`;

	expect(treeMiddleware(input)).toEqual(expected);
});
