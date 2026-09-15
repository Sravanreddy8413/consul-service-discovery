const express = require("express");

const app = express();

const SERVICE_NAME = "Service C";
const PORT = 3003;

app.get("/info", (req, res) => {
    res.json({
        service: SERVICE_NAME,
        timestamp: new Date().toISOString(),
        hostname: require("os").hostname()
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: SERVICE_NAME
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
