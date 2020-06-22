class HooksLogPlugins {
	apply(compiler) {

		const hooks = compiler.hooks;

		hooks.beforeRun.tap("MyPlugins", () => console.log("beforeRun"));
		hooks.run.tap("MyPlugins", () => console.log("run"));
		hooks.normalModuleFactory.tap("MyPlugins", () =>
			console.log("normalModuleFactory")
		);
		hooks.contextModuleFactory.tap("MyPlugins", () =>
			console.log("contextModuleFactory")
		);
		hooks.beforeCompile.tap("MyPlugins", () =>
			console.log("beforeCompile")
		);
		hooks.compile.tap("MyPlugins", () => console.log("compile"));
		hooks.thisCompilation.tap("MyPlugins", () =>
			console.log("thisCompilation")
		);
		hooks.compilation.tap("MyPlugins", () => console.log("compilation"));
		hooks.afterCompile.tap("MyPlugins", () => console.log("afterCompile"));
		hooks.make.tap("MyPlugins", () => console.log("make"));
		hooks.shouldEmit.tap("MyPlugins", (data, cb) => console.log("shouldEmit"));
		hooks.emit.tap("MyPlugins", (data) => console.log("emit"));
		hooks.assetEmitted.tap("MyPlugins", (data) => console.log("assetEmitted", data.assets));
		hooks.afterEmit.tap("MyPlugins", (data) => console.log("afterEmit", data.assets));
		hooks.done.tap("MyPlugins", (data) => console.log("done",data.assets));


		hooks.additionalPass.tap("MyPlugins", () =>
			console.log("additionalPass")
		);
		hooks.watchRun.tap("MyPlugins", () => console.log("watchRun"));
		hooks.failed.tap("MyPlugins", () => console.log("failed"));
		hooks.invalid.tap("MyPlugins", () => console.log("invalid"));
		hooks.watchClose.tap("MyPlugins", () => console.log("watchClose"));
		hooks.infrastructureLog.tap("MyPlugins", () =>
			console.log("infrastructureLog")
		);
		hooks.environment.tap("MyPlugins", () => console.log("environment"));
		hooks.afterEnvironment.tap("MyPlugins", () =>
			console.log("afterEnvironment")
		);
		hooks.afterPlugins.tap("MyPlugins", () => console.log("afterPlugins"));
		hooks.afterResolvers.tap("MyPlugins", () =>
			console.log("afterResolvers")
		);
		hooks.entryOption.tap("MyPlugins", () => console.log("entryOption"));
		hooks.infrastructurelog.tap("MyPlugins", () =>
			console.log("infrastructurelog")
		);
	}
};

module.exports = HooksLogPlugins
