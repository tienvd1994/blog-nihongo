module.exports = {
    dev: {
        files: [
            {
                cwd: '<%= appConfig.dirs.build.dev %>',
                src: ['<%= appConfig.appFiles.html %>'],
                syncWith: 'src'
            },
            {
                cwd: '<%= appConfig.dirs.build.dev %>/src',
                src: ['**/*.js'],
                syncWith: 'src'
            },
            {
                cwd: '<%= appConfig.dirs.build.dev %>/bower_components',
                src: [
                    '**/*.js',
                    '**/*.css'
                ],
                syncWith: 'bower_components'
            }
        ]
    }
};
