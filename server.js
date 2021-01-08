const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const csv = require("csvtojson");
const request = require("request");
const joi = require("joi");

const port = "4200";
const app = express();
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Home");
});

// HTTP POST end point
app.post(
  "/",
  async (req, res, next) => {
    try {
      const schema = joi.object({
        url: joi
          .string()
          .uri()
          .regex(/\.csv$/)
          .required(),
        select_fields: joi.array()
      });

      await schema.validateAsync(req.body.csv);
    } catch (e) {
      res.status(400).send(e.message);
    }
    next();
  },

  async (req, res) => {
    try {
      const { url, select_fields } = req.body.csv;

      const jsonArray = await csv().fromStream(request.get(url));
      // return jsonArray
      if(jsonArray.length < 1){
        res.status(200).json({
          message: "Please enter a valid CSV url"
        });
      }
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
        error: `Ops, ${error.message}`,
        message: 'Please Enter a valid payload'
      });
    }
  }
);

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
