const router = require("express").Router();
const client = require("../utils/plaidClient");

router.post("/create-link-token", async (req, res) => {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: "user-id",
      },
      client_name: "PFM Dashboard",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });

    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating link token",
    });
  }
});

module.exports = router;
