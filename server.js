const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const csv = require("csvtojson");
const request = require("request");
const joi = require("joi");

const port = "3999";
const app = express();
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Home");
});

// HTTP POST end point
app.post(
  "/",
  (req, res, next) => {
    
  },
  async (req, res) => {
    console.log(req.body.constructor);
    console.log(Object.keys(req.body));
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      // console.log();
    }

    try {
      const { url, select_fields } = req.body.csv;

      const jsonArray = await csv().fromStream(request.get(url));

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
    } catch (error) {
      res.status(500).json({
        message: "Ops, something went wrong."
      });
    }
  }
);

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
