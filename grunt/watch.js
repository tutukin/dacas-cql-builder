module.exports = {
    grunt: {
        files: '<%= jshint.grunt %>',
        options: {
            reload: true
        }
    },

    code: {
        files: '<%= jshint.source %>',
        tasks: ['jshint:source', 'mochaTest']
    },

    tests: {
        files: '<%= jshint.test %>',
        tasks: ['jshint:test', 'mochaTest']
    }

};
