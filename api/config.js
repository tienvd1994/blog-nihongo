module.exports = {
    domain: 'http://localhost:3000/',
    frontend_domain: 'http://localhost:9001/',
    video_url_template: 'http://localhost:1935/giangcoffee/_definst_/mp4:$$VIDEO_URL$$/playlist.m3u8',
    name: 'elearning-api',
    root_dir: 'E:\\Works\\Projects\\Elearning\\rest-api\\',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    // base_url: process.env.BASE_URL || 'http://localhost:3000',
    // base_url: process.env.BASE_URL || 'http://api.elearning.dev:3000',
    pagination: {
        page: 1,
        limit: 12
    },
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning-api',
        // uri: 'mongodb://115.146.121.250:27017/elearning-api',
        // authorizationEnabled: true,
        // auth: {
        //     user: "elearning",
        //     password: "Elearning@2018"
        // }
    },
    cors: ['http://localhost:9001', 'http://localhost:3000', 'http://localhost:9002'],
    jwt: {
        public_key: 'var/jwt/public.pem',
        private_key: 'var/jwt/private.pem',
        token_expire: '1d',
        hash_algorithm: 'RS256'
    },
    public_url: [
        '/api/v1/categories',
        '/api/v1/collections',
        /\/api\/v1\/courses[.]*/,
        /\/api\/v1\/users[.]*/,
        '/api/v1/bootstrap',
        /\/api\/v1\/subcategories[.]*/,
        /\/api\/v1\/topics[.]*/,
        '/api/v1/checkToken',
        '/api/v1/register',
        '/api/v1/getToken',
        /\/xdomain\/?.*/,
        /\/upload\/?.*/,
        '/api/v1/suggestcourse',
        /\/api\/v1\/categories[.]*/,
        '/api/v1/myCourses',
        '/api/v1/courses-search',
        '/api/v1/search',
        '/api/v1/lectures',
        /\/api\/v1\/courselogs[.]*/,
        '/api/v1/resetting/sendEmail',
        '/api/v1/requests',
        /^\/api\/v1\/resetting/,
        /^\/api\/v1\/activate/,
        /^\/api\/v1\/usefulreviews/,
        '/api/v1/bestinstructor',
        '/api/v1/loginGoogle',
        /^\/api\/v1\/loginFacebook/
    ],
    non_json_route: [
        '/api/v1/uploadFiles',
    ],
    mail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        from: '"Vu Tien" <tienvd1994@gmail.com>',
        credentials: {
            user: 'tienvd1994@gmail.com',
            pass: 'vuduytien1994'
        }
    },
    security: {
        special_character_pattern: /[\/\\()~%:*?<>{}]/g
    }
};
