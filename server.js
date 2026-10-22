
require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");

const app = express();
app.use(express.json());

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from the environment");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Example: check that the Stripe key works.
// Never return the key to the browser.
app.get("/api/stripe-check", async (req, res) => {
  try {
    const account = await stripe.accounts.retrieve();

    res.json({
      connected: true,
      accountId: account.id
    });
  } catch (error) {
    console.error("Stripe request failed:", error.message);
    res.status(502).json({
      connected: false,
      error: "Could not verify the Stripe connection"
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "127.0.0.1", () => {
  console.log(`Backend running on port ${port}`);
});
