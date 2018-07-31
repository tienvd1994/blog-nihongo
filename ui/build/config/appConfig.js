module.exports = {
    dirs: {
        build: {
            dev: 'build/targets/dev',
            prod: 'build/targets/prod'
        },
        temp: 'build/temp'
    },
    deployment: {
        origin: {
            dev: {
                match: /localhost:3000/g,
                val: 'localhost:3000'
            },
            prod: {
                val: 'api.elearning.dev'
            }
        },

        apiEndPoint: {
            dev: 'http://localhost:3000/api',
            prod: 'http://api.elearning.dev/api'
        }
    },
    envFiles: {
        js: [
            'src/browserCheck.js'
        ]
    },
    appFiles: {
        js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js', '!src/app/app.js', '!src/app/bootstrap.js'],
        coreJs: ['src/app/app.js', 'src/app/bootstrap.js'],
        tests: ['src/**/*.spec.js'],
        appTemplates: ['src/app/**/*/*.tpl.html'],
        commonTemplates: ['src/common/**/*/*.tpl.html'],
        scss: ['src/styles/ui/**/*.scss'],
        css: [],
        html: ['src/*.html'],
        swf: ['bower_components/video.js/dist/video-js.swf']
    },
    vendorFiles: {
        js: [
            'bower_components/jquery/dist/jquery.min.js',
            "bower_components/bootstrap/dist/js/bootstrap.js",
            "node_modules/metismenu/dist/metisMenu.js",
            'bower_components/underscore/underscore-min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-deferred-bootstrap/angular-deferred-bootstrap.js',
            'bower_components/angular-underscore-module/angular-underscore-module.js',
            'bower_components/restangular/dist/restangular.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/moment/min/moment.min.js',
            'bower_components/moment/locale/vi.js',
            'src/scripts/js/*.*',
        ],
        css: [
            'src/styles/customvendor/**/*.css',
            "bower_components/bootstrap/dist/css/bootstrap.css",
            "node_modules/metismenu/dist/metisMenu.css",
            'src/styles/home/**/*.css',
        ],
        font: [
            'src/styles/home/fonts/*.*',
            // 'bower_components/font-awesome/fonts/*.*',
        ]
    }
};
