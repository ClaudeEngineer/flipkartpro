/**
 * checkDB.js  —  Run this to verify your MongoDB connection & data
 * Usage:  node backend/utils/checkDB.js
 */
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const path     = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopkart";

const check = async () => {
  console.log("\n🔍 ShopKart DB Health Check");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡 URI : ${MONGO_URI}`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅  Connection : OK\n");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    console.log("📂 Collections found:", names.join(", ") || "NONE");

    for (const name of ["products","users","orders","carts"]) {
      if (names.includes(name)) {
        const count = await db.collection(name).countDocuments();
        const icon  = count > 0 ? "✅" : "⚠️ ";
        console.log(`   ${icon} ${name.padEnd(10)} : ${count} documents`);
      } else {
        console.log(`   ❌  ${name.padEnd(10)} : NOT FOUND`);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const prodCount = names.includes("products")
      ? await db.collection("products").countDocuments()
      : 0;

    if (prodCount === 0) {
      console.log("⚠️  No products found! Run the seeder:\n");
      console.log("   cd shopkart");
      console.log("   npm run seed\n");
    } else {
      console.log(`🎉  Everything looks good! ${prodCount} products in DB.\n`);
    }
  } catch (err) {
    console.error("\n❌  Connection FAILED:", err.message);
    if (err.message.includes("ECONNREFUSED")) {
      console.error("\n💡  MongoDB is not running. Try:");
      console.error("   • Local   →  mongod");
      console.error("   • Atlas   →  check MONGO_URI in backend/.env\n");
    } else if (err.message.includes("Authentication failed")) {
      console.error("\n💡  Wrong username/password in your Atlas URI.\n");
    } else if (err.message.includes("ETIMEOUT")) {
      console.error("\n💡  Atlas IP not whitelisted. Add 0.0.0.0/0 in Atlas Network Access.\n");
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

check();
