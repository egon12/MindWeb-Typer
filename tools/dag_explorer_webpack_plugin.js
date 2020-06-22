const fs = require("fs");

const html = `<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<style> html, body { height: "100%"; margin: 0; padding: 0; } </style>
</head>
<body>
<div id="container" style="margin:'5px';"></div>
<button id="reset" type="button" style="position:fixed;top:0;">Reset</button>
<script>
window.dag_content = "{{.DAG}}"
</script>
{{.script}}
</body>
</html>
`;

class DagExplorerWebpackPlugin {
	apply(compiler) {
		const hooks = compiler.hooks;
		hooks.afterEmit.tap("create-dag-explorer-html", data => {
			const script =
				'<script type="text/javascript">' +
				data.assets["dag_explorer.js"]._value +
				"</script>";
			fs.writeFileSync(
				__dirname + "/../html/dag_explorer_empty.html",
				html.replace("{{.script}}", script)
			);
		});
	}
}

module.exports = DagExplorerWebpackPlugin;
