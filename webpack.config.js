module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "./bin/buffer-in-time.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
