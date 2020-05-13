import React, { useEffect } from "react";
import SwaggerUI from "swagger-ui"

import logo from "../../asset/image/logo.png";

import "./App.scss";

const App = ({ openapi }) => {
    useEffect(() => {
        SwaggerUI({
            dom_id: "#swagger-ui",
            url: openapi,
        });
    }, []);

    const year = new Date().getFullYear();

    return (
        <>
            <header>
                <a className="header-logo" href="https://www.factorio-item-browser.com/">
                    <img src={logo} alt="Factorio Item Browser" />
                </a>
            </header>
            <div className="content-wrapper">
                <div id="swagger-ui" />
            </div>
            <footer>
                <div className="copyright">© {year} Factorio Item Browser</div>
            </footer>
        </>
    );
};

export default App;
