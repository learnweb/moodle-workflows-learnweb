const { getWorkflowConfig } = require('./workflow_config');
const core = require('@actions/core');

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
