module.exports = function (grunt) {
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        }
    });
    // Dependencies
    grunt.loadNpmTasks('grunt-mocha-test');

    // Run tests
    grunt.registerTask('test', ['mochaTest']);

    // Default tasks
    //grunt.registerTask('default', ['concurrent:start']);
};

