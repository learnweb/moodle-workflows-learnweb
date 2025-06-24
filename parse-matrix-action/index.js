const core = require('@actions/core');

try {
    let {
        "main-db": mainDb,
        "main-php": mainPhp,
        "main-moodle": mainMoodle,
        "moodle-testmatrix": moodleTestmatrix,
        "moodle-plugin-ci": moodlePluginCi,
        "additional_plugins": additionalPlugins
    } = JSON.parse(core.getInput('input'));

    mainDb ??= "pgsql";
    moodleTestmatrix ??= {};
    additionalPlugins ??= [];

    core.setOutput("moodle_plugin_ci", moodlePluginCi);
    core.setOutput("additional_plugins", JSON.stringify(additionalPlugins));

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
