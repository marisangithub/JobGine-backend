require("dotenv").config();
const dns = require("dns");
const app = require("./app");

dns.setDefaultResultOrder("ipv4first");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

