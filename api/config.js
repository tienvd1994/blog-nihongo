module.exports = {
    domain: 'http://localhost:3000/',
    frontend_domain: 'http://localhost:9001/',
    name: 'blog-nihongo',
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
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-nihongo',
        // uri: 'mongodb://115.146.121.250:27017/blog-nihongo',
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
        '/api/v1/tests',
        '/api/v1/categories'
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
