import "./partial/normalize.scss";
import "./partial/swagger-ui.scss";

import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

ReactDOM.render(
    <App openapi={CONFIG.openApiUrl} />,
    document.getElementById("app")
);
