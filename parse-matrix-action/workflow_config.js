function getWorkflowConfig() {
    // LEARNWEB-TODO: add  functionality to automatically update the contents of the attributes.

    return {
        "moodle-plugin-ci": "4.5.8",
        "main-moodle": "MOODLE_500_STABLE",
        "main-php": "8.3",
        "main-db": "pgsql",
        "moodle-testmatrix": {
            "MOODLE_401_STABLE": {
                "php": ["8.0", "8.1"]
            },
            "MOODLE_404_STABLE": {
                "php": ["8.1", "8.2", "8.3"]
            },
            "MOODLE_405_STABLE": {
                "php": ["8.1", "8.2", "8.3"],
                "db": ["pgsql", "mariadb", "mysqli"]
            },
            "MOODLE_500_STABLE": {
                "php": ["8.2", "8.3", "8.4"],
                "db": ["pgsql", "mariadb", "mysqli"]
            }
        }
    };
}

module.exports = { getWorkflowConfig };