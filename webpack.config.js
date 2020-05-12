const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = (env, argv) => {
    const currentPath = path.join(__dirname);
    const isProduction = argv.mode === "production";

    return {
        entry: `${currentPath}/src/index.jsx`,
        output: {
            path: `${currentPath}/build`,
            publicPath: "/",
            filename: isProduction ? "asset/js/[name].[hash].js" : "asset/js/[name].js",
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
                            options: {
                                hmr: !isProduction,
                            },
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
                                disable: !isProduction,
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
                                disable: !isProduction,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: isProduction ? "asset/css/[name].[hash].css" : "asset/css/[name].css",
            }),
            new HtmlWebpackPlugin({
                template: `${currentPath}/src/index.ejs`,
            }),
        ],
        devServer: {
            contentBase: "./build",
            port: 8090,
            hot: true,
        },
    };
};
