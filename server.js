const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const csv = require("csvtojson");
const request = require("request");
// const fs = require("fs");

const port = "3999";
const app = express();
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Home");
});

// HTTP POST end point
app.post("/", async (req, res) => {
  const { url, select_fields } = req.body.csv;

  const arr = [];

  const jsonArray = await csv().fromStream(request.get(url));

  // jsonArray
  if (!select_fields) {
    res.status(200).json({
      conversion_key: uuidv4(),
      json: jsonArray
    });
  }

  const result = jsonArray.map(obj => {
    return _.pick(obj, select_fields);
  });

  res.status(200).json({
    conversion_key: uuidv4(),
    json: result
  });
});

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
