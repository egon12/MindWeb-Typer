import { DepGraph, convert } from './convert'


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


