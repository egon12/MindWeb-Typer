function Validator() {
	this.isString = function (param) {
		return typeof param === "string" || param instanceof String;
	};

	this.isNumber = function (param) {
		return typeof param === "number" || param instanceof Number;
	};

	this.isObject = function (param) {
		return typeof param === "object" && !Array.isArray(param);
	};

	this.isHasId = function (param) {
		if (param.id === undefined) {
			return false;
		}

		return this.isString(param.id) || this.isNumber(param.id);
	};

	this.isHas = function (prop, param) {
		return param[prop] !== undefined;
	};

	this.isValidInputObject = function (param) {
		return (
			this.isObject(param) &&
			this.isHasId(param) &&
			this.isHas("x", param) &&
			this.isHas("y", param)
		);
	};

	this.isValidLinkObject = function (param) {
		if (this.isString(param)) {
			return true;
		}

		return this.isObject(param) && this.isHasId(param);
	};

	this.isValidInput = function (param) {
		if (!Array.isArray(param)) {
			return false;
		}
		for (var i in param) {
			if (!this.isValidInputObject(param[i])) {
				return false;
			}
		}
		return true;
	};

	this.isValidLink = function (param) {
		if (!Array.isArray(param)) {
			return false;
		}
		for (var i in param) {
			if (!this.isValidLinkObject(param[i])) {
				return false;
			}
		}
		return true;
	};
}
