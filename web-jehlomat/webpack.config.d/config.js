// override config here

var webpack = require('webpack');

config.plugins = [
    new webpack.DefinePlugin({
        "process.env.GOOGLE_MAPS_KEY": JSON.stringify(process.env.GOOGLE_MAPS_KEY)
    }),
]