import { convertToDepGraph } from "./convert";
import { calculate } from "./pos_calculator";

test("it should give use the x position", () => {
	const text = "A\n B\n C\n D A B C\n";

	const dg = convertToDepGraph(text);
	calculate(dg)
	const nodes = Object.values(dg.nodes)

	expect(nodes[0].x).toBe(1);
	expect(nodes[1].x).toBe(2);
	expect(nodes[2].x).toBe(3);
	expect(nodes[3].x).toBe(2);
});


test("it should give use the x position in center", () => {
	const text = "A\n B\n C\n D A B C E\nE";

	const dg = convertToDepGraph(text);
	calculate(dg)
	const nodes = Object.values(dg.nodes)

	expect(nodes[0].x).toBe(1);
	expect(nodes[1].x).toBe(2);
	expect(nodes[2].x).toBe(3);
	expect(nodes[3].x).toBe(2.5);
	expect(nodes[4].x).toBe(4);
});


test.skip("it should give use the x position dependencies", () => {
	const text = "A\n B\n C\n D C E\nE\nF A B";

	const dg = convertToDepGraph(text);
	calculate(dg)
	expect(dg.uniqueTree()).toEqual(['D', 'F'])

	expect(dg.get('A').x).toBe(1);
	expect(dg.get('B').x).toBe(2);
	expect(dg.get('C').x).toBe(3);
	expect(dg.get('E').x).toBe(4);
	expect(dg.get('D').x).toBe(3.5);
	expect(dg.get('F').x).toBe(1.6);
});