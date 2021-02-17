const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { DefinePlugin } = require("webpack");

const PROJECT_DIR = path.join(__dirname);
const BUILD_DIR = `${PROJECT_DIR}/build`
const CONFIG = require(`${PROJECT_DIR}/config.json`);
const IS_PRODUCTION = process.argv.indexOf("production") !== -1;

/**
 * Prepares the config for the DefinePlugin, recursively stringifying all values.
 * @param {*} config
 * @returns {*}
 */
function prepareConfigForDefinePlugin(config) {
    if (typeof(config) !== "object") {
        return JSON.stringify(config);
    }

    const result = {};
    for (const [key, value] of Object.entries(config)) {
        result[key] = prepareConfigForDefinePlugin(value);
    }
    return result;
}

module.exports = Object.entries(CONFIG).map(([pageName, pageConfig]) => {
    return {
        entry: `${PROJECT_DIR}/src/index.jsx`,
        output: {
            path: `${BUILD_DIR}/${pageName}`,
            publicPath: IS_PRODUCTION ? "./" : "/",
            filename: "asset/js/[name].js",
        },
        resolve: {
            extensions: [".js", ".jsx", ".jpg", ".png"],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [
                        "babel-loader",
                    ],
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /layout\/.*\.(jpg|png)$/,
                    use: [
                        "url-loader",
                        {
                            loader: "image-webpack-loader",
                            options: {
                                disable: !IS_PRODUCTION,
                            },
                        },
                    ],
                },
                {
                    test: /\.(jpg|png)$/,
                    exclude: /layout/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "asset/image/[name].[ext]",
                                esModule: false,
                            },
                        },
                        {
                            loader: "image-webpack-loader",
                            options: {
                                disable: !IS_PRODUCTION,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new DefinePlugin(prepareConfigForDefinePlugin({
                CONFIG: pageConfig,
            })),
            new MiniCssExtractPlugin({
                filename: "asset/css/[name].css",
            }),
            new HtmlWebpackPlugin({
                template: `${PROJECT_DIR}/src/index.ejs`,
            }),
        ],
        devServer: {
            contentBase: "./build/",
            port: 8090,
            hot: true,
        },
    };
});
