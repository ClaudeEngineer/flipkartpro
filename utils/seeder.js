const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const path     = require("path");
const bcrypt   = require("bcryptjs");

// ✅ Resolve .env correctly from any working directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopkart";

const User    = require("../models/User");
const Product = require("../models/Product");
const Order   = require("../models/Order");
const Cart    = require("../models/Cart");

// ─── SEED DATA ─────────────────────────────────────────────────────────────

const users = [
  { name:"Admin User", email:"admin@shopkart.com", password:"admin123", role:"admin" },
  { name:"Demo User",  email:"demo@shopkart.com",  password:"demo1234", role:"user"  },
];

// ✅ ALL products have isActive:true explicitly set
//    (insertMany() skips Mongoose defaults — must be explicit)
const products = [

  // ════════ MEN ════════════════════════════════════════════════════════════
  {
    name:"Premium Oxford Shirt",
    description:"Premium cotton Oxford shirt with button-down collar. Perfect for office and casual wear. Breathable fabric for all-day comfort.",
    price:1299, originalPrice:1899, category:"Men", subCategory:"Shirts",
    emoji:"👔", colorHex:"#0D1B3E",
    sizes:["S","M","L","XL","XXL"], colors:["White","Blue","Black"],
    stock:150, badge:"Bestseller", rating:4.5, numReviews:128,
    isFeatured:true, isActive:true,
    tags:["shirt","oxford","formal","casual"],
  },
  {
    name:"Tapered Slim Jeans",
    description:"Modern slim-fit jeans crafted from premium stretch denim. Comfortable all-day wear with a sleek, tailored look.",
    price:1899, originalPrice:2499, category:"Men", subCategory:"Jeans",
    emoji:"👖", colorHex:"#0A1628",
    sizes:["28","30","32","34","36"], colors:["Blue","Black","Grey"],
    stock:120, badge:"New", rating:4.3, numReviews:95,
    isFeatured:true, isActive:true,
    tags:["jeans","denim","slim","casual"],
  },
  {
    name:"Cloud Runner Sneakers",
    description:"High-performance running shoes with air cushion sole. Lightweight mesh upper for breathability and speed.",
    price:2499, originalPrice:3499, category:"Men", subCategory:"Sneakers",
    emoji:"👟", colorHex:"#1C0A3E",
    sizes:["6","7","8","9","10","11"], colors:["White","Black","Red"],
    stock:80, badge:"Hot", rating:4.7, numReviews:203,
    isFeatured:true, isActive:true,
    tags:["sneakers","running","sports","shoes"],
  },
  {
    name:"Leather Derby Shoes",
    description:"Handcrafted full-grain leather derby shoes with cushioned insole for all-day comfort.",
    price:3299, originalPrice:4499, category:"Men", subCategory:"Shoes",
    emoji:"👞", colorHex:"#1A1000",
    sizes:["6","7","8","9","10","11"], colors:["Brown","Black"],
    stock:60, badge:null, rating:4.6, numReviews:87,
    isFeatured:false, isActive:true,
    tags:["shoes","leather","formal"],
  },
  {
    name:"Urban Bomber Jacket",
    description:"Street-style bomber jacket with ribbed cuffs and water-resistant outer shell.",
    price:2799, originalPrice:3999, category:"Men", subCategory:"Jackets",
    emoji:"🧥", colorHex:"#071428",
    sizes:["S","M","L","XL"], colors:["Black","Olive","Navy"],
    stock:90, badge:"Sale", rating:4.4, numReviews:142,
    isFeatured:true, isActive:true,
    tags:["jacket","bomber","winter","casual"],
  },
  {
    name:"Oversized Graphic Tee",
    description:"Trendy oversized tee with bold graphic prints. Made from 100% pure cotton for ultimate softness.",
    price:699, originalPrice:999, category:"Men", subCategory:"T-Shirts",
    emoji:"👕", colorHex:"#180A2E",
    sizes:["S","M","L","XL","XXL"], colors:["White","Black","Grey"],
    stock:200, badge:null, rating:4.2, numReviews:310,
    isFeatured:false, isActive:true,
    tags:["tshirt","graphic","casual","cotton"],
  },
  {
    name:"Tactical Cargo Shorts",
    description:"Multi-pocket cargo shorts with durable ripstop fabric and adjustable waistband.",
    price:999, originalPrice:1299, category:"Men", subCategory:"Shorts",
    emoji:"🩳", colorHex:"#0A1E0A",
    sizes:["28","30","32","34","36"], colors:["Khaki","Black","Navy"],
    stock:110, badge:null, rating:4.1, numReviews:67,
    isFeatured:false, isActive:true,
    tags:["shorts","cargo","outdoor","casual"],
  },
  {
    name:"Fleece Pullover Hoodie",
    description:"Ultra-soft fleece hoodie with kangaroo pocket. Perfect for cool weather layering.",
    price:1599, originalPrice:2199, category:"Men", subCategory:"Hoodies",
    emoji:"🧤", colorHex:"#0A1F2E",
    sizes:["S","M","L","XL","XXL"], colors:["Black","Grey","Navy"],
    stock:130, badge:"Trending", rating:4.5, numReviews:189,
    isFeatured:true, isActive:true,
    tags:["hoodie","fleece","casual","winter"],
  },

  // ════════ WOMEN ══════════════════════════════════════════════════════════
  {
    name:"Floral Wrap Dress",
    description:"Elegant floral wrap dress with flattering A-line silhouette. Perfect for brunches, parties and special occasions.",
    price:1599, originalPrice:2299, category:"Women", subCategory:"Dresses",
    emoji:"👗", colorHex:"#2E0818",
    sizes:["XS","S","M","L","XL"], colors:["Floral Red","Floral Blue","Floral Green"],
    stock:100, badge:"Bestseller", rating:4.8, numReviews:254,
    isFeatured:true, isActive:true,
    tags:["dress","floral","midi","elegant","party"],
  },
  {
    name:"High-Waist Skinny Jeans",
    description:"Figure-flattering high-waist jeans with stretch comfort. Versatile from daywear to evening.",
    price:1799, originalPrice:2499, category:"Women", subCategory:"Jeans",
    emoji:"👖", colorHex:"#16082E",
    sizes:["24","26","28","30","32"], colors:["Blue","Black","Light Blue"],
    stock:140, badge:"New", rating:4.4, numReviews:176,
    isFeatured:true, isActive:true,
    tags:["jeans","highwaist","skinny","denim"],
  },
  {
    name:"Strappy Block Heel Sandals",
    description:"Chic block heel sandals with adjustable ankle strap. 3-inch heel perfect for day-to-night wear.",
    price:1299, originalPrice:1999, category:"Women", subCategory:"Sandals",
    emoji:"👡", colorHex:"#2E1008",
    sizes:["3","4","5","6","7","8"], colors:["Nude","Black","Red"],
    stock:75, badge:null, rating:4.3, numReviews:132,
    isFeatured:false, isActive:true,
    tags:["sandals","heels","formal","party"],
  },
  {
    name:"Satin Silk Blouse",
    description:"Luxurious satin-finish silk blouse with relaxed fit. Pairs beautifully with trousers or skirts.",
    price:1199, originalPrice:1699, category:"Women", subCategory:"Shirts",
    emoji:"👚", colorHex:"#08201A",
    sizes:["XS","S","M","L","XL"], colors:["White","Pink","Lavender"],
    stock:85, badge:"Trending", rating:4.6, numReviews:98,
    isFeatured:true, isActive:true,
    tags:["blouse","silk","formal","elegant"],
  },
  {
    name:"Chelsea Ankle Boots",
    description:"Timeless Chelsea ankle boots with block heel and elastic side panels for easy wear.",
    price:2299, originalPrice:3299, category:"Women", subCategory:"Shoes",
    emoji:"👢", colorHex:"#1A1400",
    sizes:["3","4","5","6","7","8"], colors:["Black","Brown","Beige"],
    stock:65, badge:"Hot", rating:4.5, numReviews:211,
    isFeatured:true, isActive:true,
    tags:["boots","chelsea","heels","formal","winter"],
  },
  {
    name:"Pastel Oversized Hoodie",
    description:"Super cozy oversized hoodie in soft pastel shades. Pre-shrunk cotton blend.",
    price:1399, originalPrice:1899, category:"Women", subCategory:"Hoodies",
    emoji:"🧥", colorHex:"#220830",
    sizes:["XS","S","M","L","XL"], colors:["Pink","Lavender","White"],
    stock:160, badge:"Sale", rating:4.7, numReviews:289,
    isFeatured:true, isActive:true,
    tags:["hoodie","oversized","pastel","casual"],
  },
  {
    name:"Mesh Low-Top Sneakers",
    description:"Lightweight athleisure sneakers with breathable mesh upper and cushioned sole.",
    price:2099, originalPrice:2999, category:"Women", subCategory:"Sneakers",
    emoji:"👟", colorHex:"#1E1030",
    sizes:["3","4","5","6","7","8"], colors:["White","Pink","Black"],
    stock:95, badge:null, rating:4.4, numReviews:163,
    isFeatured:false, isActive:true,
    tags:["sneakers","athleisure","casual","shoes"],
  },
  {
    name:"Boho Embroidered Maxi Dress",
    description:"Free-spirited boho maxi dress with delicate embroidery. Flowy silhouette for festivals and beach trips.",
    price:1899, originalPrice:2699, category:"Women", subCategory:"Dresses",
    emoji:"👘", colorHex:"#162000",
    sizes:["XS","S","M","L","XL"], colors:["Earth Tones","Blue","Green"],
    stock:70, badge:"New", rating:4.6, numReviews:145,
    isFeatured:false, isActive:true,
    tags:["dress","boho","maxi","embroidered","beach"],
  },

  // ════════ KIDS ════════════════════════════════════════════════════════════
  {
    name:"Dino Print T-Shirt",
    description:"Adorable dinosaur print tee for little adventurers. Extra soft jersey fabric, pre-washed and colourfast.",
    price:499, originalPrice:799, category:"Kids", subCategory:"T-Shirts",
    emoji:"🦕", colorHex:"#002E18",
    sizes:["2Y","4Y","6Y","8Y","10Y"], colors:["Green","Blue","Yellow"],
    stock:250, badge:"Bestseller", rating:4.9, numReviews:312,
    isFeatured:true, isActive:true,
    tags:["kids","tshirt","dino","cartoon","cotton"],
  },
  {
    name:"Classic Denim Dungaree",
    description:"Cute denim dungaree with adjustable straps and easy snap closures for quick changes.",
    price:899, originalPrice:1299, category:"Kids", subCategory:"Jeans",
    emoji:"👶", colorHex:"#001A2E",
    sizes:["1Y","2Y","3Y","4Y","5Y"], colors:["Blue","Light Blue"],
    stock:180, badge:"New", rating:4.7, numReviews:198,
    isFeatured:true, isActive:true,
    tags:["kids","dungaree","denim","toddler"],
  },
  {
    name:"Light-Up Velcro Shoes",
    description:"Fun LED light-up sneakers with easy velcro closure. Durable rubber sole with anti-slip grip.",
    price:799, originalPrice:1199, category:"Kids", subCategory:"Shoes",
    emoji:"👟", colorHex:"#2E0010",
    sizes:["1","2","3","4","5","6"], colors:["Blue","Red","Pink"],
    stock:200, badge:"Hot", rating:4.8, numReviews:267,
    isFeatured:true, isActive:true,
    tags:["kids","shoes","lightup","velcro"],
  },
  {
    name:"Glitter Princess Dress",
    description:"Every little girl's dream — sparkly princess dress with tulle skirt and satin bodice. Machine washable.",
    price:1099, originalPrice:1599, category:"Kids", subCategory:"Dresses",
    emoji:"👸", colorHex:"#280030",
    sizes:["2Y","4Y","6Y","8Y","10Y"], colors:["Pink","Purple","Blue"],
    stock:120, badge:"Trending", rating:4.9, numReviews:423,
    isFeatured:true, isActive:true,
    tags:["kids","dress","princess","party","girls"],
  },
  {
    name:"Adventure Cargo Shorts",
    description:"Rugged cargo shorts for active kids with multiple pockets and reinforced knees.",
    price:599, originalPrice:899, category:"Kids", subCategory:"Shorts",
    emoji:"🩳", colorHex:"#182000",
    sizes:["2Y","4Y","6Y","8Y","10Y"], colors:["Khaki","Navy","Black"],
    stock:190, badge:null, rating:4.5, numReviews:134,
    isFeatured:false, isActive:true,
    tags:["kids","shorts","cargo","boys","casual"],
  },
  {
    name:"Waterproof Rain Boots",
    description:"100% waterproof rubber boots with easy-pull handles. Fun colours to make rainy days exciting.",
    price:699, originalPrice:999, category:"Kids", subCategory:"Shoes",
    emoji:"🥾", colorHex:"#2E0008",
    sizes:["1","2","3","4","5","6"], colors:["Red","Yellow","Blue"],
    stock:150, badge:"Sale", rating:4.6, numReviews:189,
    isFeatured:false, isActive:true,
    tags:["kids","boots","rain","waterproof","shoes"],
  },
  {
    name:"Zip-Up Fleece Hoodie Kids",
    description:"Warm zip-up hoodie with two front pockets. Soft anti-pill fleece for cool weather.",
    price:799, originalPrice:1199, category:"Kids", subCategory:"Hoodies",
    emoji:"🧒", colorHex:"#200030",
    sizes:["2Y","4Y","6Y","8Y","10Y","12Y"], colors:["Grey","Navy","Purple"],
    stock:175, badge:null, rating:4.4, numReviews:112,
    isFeatured:false, isActive:true,
    tags:["kids","hoodie","zipper","winter","fleece"],
  },
  {
    name:"Tropical Print Shirt",
    description:"Vibrant tropical print shirt for boys. Lightweight cotton poplin, perfect for summer.",
    price:549, originalPrice:849, category:"Kids", subCategory:"Shirts",
    emoji:"🌺", colorHex:"#003020",
    sizes:["2Y","4Y","6Y","8Y","10Y"], colors:["White","Blue","Yellow"],
    stock:160, badge:"New", rating:4.3, numReviews:78,
    isFeatured:false, isActive:true,
    tags:["kids","shirt","tropical","summer","boys"],
  },
];

// ─── RUN ───────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    console.log("\n🔌 Connecting to MongoDB...");
    console.log(`   URI: ${MONGO_URI}\n`);

    await mongoose.connect(MONGO_URI);
    console.log("✅  MongoDB Connected!\n");

    // Clear all collections
    console.log("🗑️  Wiping existing data...");
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);
    console.log("   Done.\n");

    // Seed users  (User.create triggers pre-save hook → bcrypt hash)
    console.log("👤 Creating users...");
    const createdUsers = [];
    for (const u of users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`   ✅  ${createdUsers.length} users created\n`);

    // Seed products (Product.create per item to trigger middleware + defaults)
    console.log("📦 Creating products...");
    const createdProducts = [];
    for (const p of products) {
      const product = await Product.create(p);
      createdProducts.push(product);
    }
    console.log(`   ✅  ${createdProducts.length} products created\n`);

    // Quick sanity check
    const dbCount = await Product.countDocuments({ isActive: { $ne: false } });
    console.log(`🔍 Sanity check — visible products in DB: ${dbCount}`);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅   DATABASE SEEDED SUCCESSFULLY!\n");
    console.log("🔑  Admin  →  admin@shopkart.com  /  admin123");
    console.log("👤  User   →  demo@shopkart.com   /  demo1234");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("\n❌  SEEDER FAILED:", err.message);

    if (err.name === "ValidationError") {
      console.error("\n📋  Validation Errors:");
      Object.values(err.errors).forEach(e => {
        console.error(`   • ${e.path}: ${e.message}`);
      });
    }
    if (err.message.includes("ECONNREFUSED")) {
      console.error("\n💡  MongoDB not running:");
      console.error("   Mac:    brew services start mongodb-community");
      console.error("   Linux:  sudo systemctl start mongod");
      console.error("   Win:    start MongoDB service\n");
    }
    process.exit(1);
  }
};

seed();
