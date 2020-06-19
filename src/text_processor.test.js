import textProcessor from "./text_processor.js";

test("Should change word into object", function () {
	var expected = [
		{ id: "Hello", name: "Hello", x: 0, y: 0, color: "steelblue", link: [] }
	];

	expect(textProcessor("Hello")).toEqual(expected);
});

test("Should change sentences per line into object", function () {
	var expected = [
		{
			id: "Hello",
			name: "Hello",
			x: 0,
			y: 0,
			color: "steelblue",
			link: []
		},
		{ id: "Hi", name: "Hi", x: 0, y: 1, color: "steelblue", link: [] }
	];
	expect(textProcessor("Hello\nHi")).toEqual(expected);
});

test("Should able to set the color", function () {
	var expected = [
		{
			id: "Hello",
			name: "Hello",
			x: 0,
			y: 0,
			color: "steelblue",
			link: []
		},
		{ id: "Hi", name: "Hi", x: 0, y: 1, color: "steelblue", link: [] },
		{
			id: "TestColor",
			name: "TestColor",
			x: 0,
			y: 2,
			color: "red",
			link: []
		},
		{
			id: "TestColor2",
			name: "TestColor2",
			x: 0,
			y: 3,
			color: "red",
			link: []
		}
	];
	expect(textProcessor("Hello\nHi\nTestColor|red\nTestColor2|red")).toEqual(
		expected
	);
});

test("Should layouting welll with hor statement?", function () {
	var expected = [
		{ id: "Pos1", name: "Pos1", x: 0, y: 0, color: "steelblue", link: [] },
		{ id: "Pos2", name: "Pos2", x: 1, y: 0, color: "steelblue", link: [] },
		{ id: "Pos3", name: "Pos3", x: 2, y: 0, color: "steelblue", link: [] },
		{ id: "Pos4", name: "Pos4", x: 3, y: 0, color: "steelblue", link: [] }
	];
	expect(textProcessor("Pos1;0;0|hor\nPos2\nPos3\nPos4")).toEqual(expected);
});
