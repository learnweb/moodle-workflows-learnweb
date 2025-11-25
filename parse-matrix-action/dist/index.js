/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 378:
/***/ ((module) => {

function getWorkflowConfig() {
    // LEARNWEB-TODO: add  functionality to automatically update the contents of the attributes.

    return {
        "moodle-plugin-ci": "4.5.9",
        "main-moodle": "MOODLE_501_STABLE",
        "main-php": "8.3",
        "main-db": "pgsql",
        "moodle-testmatrix": {
            "MOODLE_405_STABLE": {
                "php": ["8.1", "8.2", "8.3"]
            },
            "MOODLE_500_STABLE": {
                "php": ["8.2", "8.3", "8.4"],
                "db": ["pgsql", "mariadb", "mysqli"]
            },
            "MOODLE_501_STABLE": {
                "php": ["8.2", "8.3", "8.4"],
                "db": ["pgsql", "mariadb", "mysqli"]
            }
        }
    };
}


module.exports = { getWorkflowConfig };



/***/ }),

/***/ 428:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const { getWorkflowConfig } = __nccwpck_require__(378);
const core = __nccwpck_require__(428);

try {

    // Get basic configurations.
    let {
        "moodle-plugin-ci": moodlePluginCi,
        "main-moodle": mainMoodle,
        "main-php": mainPhp,
        "main-db": mainDb,
        "moodle-testmatrix": moodleTestmatrix
    } = getWorkflowConfig();

    // Get the additional plugins attribute from the input. Plugins can also override the main attributes if wanted.
    const input = core.getInput('input');
    if (input && input.trim() !== '') {
        let {
            "additional_plugins": additionalPlugins,
            "moodle-plugin-ci": pluginMoodlePluginCi,
            "main-moodle": pluginMainMoodle,
            "main-php": pluginMainPhp,
            "main-db": pluginMainDb,
            "moodle-testmatrix": pluginMoodleTestmatrix
        } = JSON.parse(input);

        // Override the main attributes with the plugin attributes if they are set.
        moodlePluginCi = pluginMoodlePluginCi || moodlePluginCi;
        mainMoodle = pluginMainMoodle || mainMoodle;
        mainPhp = pluginMainPhp || mainPhp;
        mainDb = pluginMainDb || mainDb;
        moodleTestmatrix = pluginMoodleTestmatrix || moodleTestmatrix;
        additionalPlugins = additionalPlugins || [];
        core.setOutput("additional_plugins", JSON.stringify(additionalPlugins));
    } else {
        // As this attribute is required, we set it to an empty array if not provided.
        const additionalPlugins = [];
        core.setOutput("additional_plugins", JSON.stringify(additionalPlugins));
    }

    // Set the outputs for the action.
    core.setOutput("moodle_plugin_ci", moodlePluginCi);

    core.setOutput("static_matrix", JSON.stringify({
        include: [{
            "php": mainPhp,
            "moodle-branch": mainMoodle,
            "database": mainDb
        }]
    }));

    const testmatrix = [];

    if (Object.keys(moodleTestmatrix).length === 0) {
        testmatrix.push({
            "php": mainPhp,
            "moodle-branch": mainMoodle,
            "database": mainDb
        });
    } else {
        for (const [moodle, config] of Object.entries(moodleTestmatrix)) {
            const phpversions = config.php || [mainPhp];
            const databases = config.db || [mainDb];

            for (const php of phpversions) {
                for (const db of databases) {
                    testmatrix.push({
                        "php": php,
                        "moodle-branch": moodle,
                        "database": db
                    });
                }
            }
        }
    }

    core.setOutput("test_matrix", JSON.stringify({
        include: testmatrix
    }));

} catch (error) {
    core.setFailed(error.message);
}

module.exports = __webpack_exports__;
/******/ })()
;