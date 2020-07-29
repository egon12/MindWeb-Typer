const fs = require("fs");

const html = fs.readFileSync(__dirname + '/../src/dag_explorer.ejs').toString()

class DagExplorerWebpackPlugin {
	apply(compiler) {
		const hooks = compiler.hooks;
		hooks.afterEmit.tap("create-dag-explorer-html", data => {
			const script = '<script>window.dag_content = "{{.DAG}}"</script><script type="text/javascript">' +
				data.assets["dag_explorer.js"]._value +
				"</script>";
			fs.writeFileSync(
				__dirname + "/../html/dag_explorer_empty.html",
				html.replace(/<script>.*<\/script>/, script)
			);
		});
	}
}

module.exports = DagExplorerWebpackPlugin;
