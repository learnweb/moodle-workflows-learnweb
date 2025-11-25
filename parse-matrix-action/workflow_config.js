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

