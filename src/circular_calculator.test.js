import CircularCalculator from "./circular_calculator";

test("lets try to create something", () => {
	var input = {
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

	var expected = {
		id: "Root",
		children: [
			{
				id: "RootChild1",
				parentId: "Root",
				radians: Math.PI,
				children: [
					{
						id: "ChildFrom1_1",
						parentId: "RootChild1",
						radians: (Math.PI * 3) / 4,
						children: []
					},
					{
						id: "ChildFrom1_2",
						parentId: "RootChild1",
						radians: Math.PI,
						children: []
					},
					{
						id: "ChildFrom1_3",
						parentId: "RootChild1",
						radians: (Math.PI * 5) / 4,
						children: []
					}
				]
			},
			{
				id: "RootChild2",
				parentId: "Root",
				radians: 0,
				children: [
					{
						id: "ChildFrom2_1",
						parentId: "RootChild2",
						radians: (Math.PI * -1) / 4,
						children: []
					},
					{
						id: "ChildFrom2_2",
						parentId: "RootChild2",
						radians: 0,
						children: []
					},
					{
						id: "ChildFrom2_3",
						parentId: "RootChild2",
						radians: (Math.PI * 1) / 4,
						children: []
					}
				]
			}
		]
	};

	const cc = new CircularCalculator();
	const actual = cc.addRadians(input);

	expect(actual).toEqual(expected);
});
