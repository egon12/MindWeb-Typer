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