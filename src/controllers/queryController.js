const Query = require("../../models/query");

const query = async (req, res) => {
    try {
      const newQuery = new Query(req.body);
      const savedQuery = await newQuery.save();      
      res
        .status(200)
        .send({ message: "Query Posted Successfully!", que: savedQuery });
    } catch (err) {
      console.log("Error creating query:", err.message);
      console.log("Full error:", err);
      res.status(500).send({ 
        message: "Failed to create query", 
        error: err.message,
        details: err.toString()
      });
    }
  };

module.exports = {
  query,
};
