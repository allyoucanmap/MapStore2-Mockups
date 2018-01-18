var webpackConfig = require('./webpack.config.js');
var path = require("path");
var LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
var ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
var DefinePlugin = require("webpack/lib/DefinePlugin");
var NormalModuleReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");
const extractThemesPlugin = require('./MapStore2/themes.js').extractThemesPlugin;
// var CopyWebpackPlugin = require('copy-webpack-plugin');

webpackConfig.plugins = [
    /*new CopyWebpackPlugin([
        { from: path.join(__dirname, 'node_modules', 'bootstrap', 'less'), to: path.join(__dirname, "web", "client", "dist", "bootstrap", "less") }
    ]),*/
    new LoaderOptionsPlugin({
        debug: false,
        options: {
            postcss: {
                plugins: [
                  require('postcss-prefix-selector')({prefix: '.mockups', exclude: ['.mockups', '.ms2', '[data-ms2-container]']})
                ]
            },
            context: __dirname
        }
    }),
    new DefinePlugin({
        "__DEVTOOLS__": false
    }),
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    /*new NormalModuleReplacementPlugin(/leaflet$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "leaflet")),
    new NormalModuleReplacementPlugin(/openlayers$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "openlayers")),
    new NormalModuleReplacementPlugin(/cesium$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "cesium")),
    new NormalModuleReplacementPlugin(/proj4$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "proj4")),*/
    new NormalModuleReplacementPlugin(/ChartOptions.jsx/, path.join(__dirname, "js", "ms2override", "ChartOptions.jsx")),
    new NormalModuleReplacementPlugin(/ChartType.jsx/, path.join(__dirname, "js", "ms2override", "ChartType.jsx")),
    new NormalModuleReplacementPlugin(/ChartWizard.jsx/, path.join(__dirname, "js", "ms2override", "ChartWizard.jsx")),
    new NormalModuleReplacementPlugin(/SideCard.jsx/, path.join(__dirname, "js", "ms2override", "SideCard.jsx")),
    new NormalModuleReplacementPlugin(/Toolbar.jsx/, path.join(__dirname, "js", "ms2override", "Toolbar.jsx")),
    new NormalModuleReplacementPlugin(/WidgetsBuilder.jsx/, path.join(__dirname, "js", "ms2override", "WidgetsBuilder.jsx")),
    new NormalModuleReplacementPlugin(/Bar.jsx/, path.join(__dirname, "js", "ms2override", "Bar.jsx")),
    new ParallelUglifyPlugin({
        uglifyJS: {
            sourceMap: false,
            compress: {warnings: false},
            mangle: true
        }
    }),
    extractThemesPlugin
];
webpackConfig.devtool = undefined;

// this is a workaround for this issue https://github.com/webpack/file-loader/issues/3
// use `__webpack_public_path__` in the index.html when fixed
// /mockups/dist/
webpackConfig.output.publicPath = "";

module.exports = webpackConfig;
