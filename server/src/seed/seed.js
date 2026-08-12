import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { Bundle } from "../models/Bundle.js";
import { Review } from "../models/Review.js";
import { SiteSetting } from "../models/SiteSetting.js";

const categoriesData = [
  { name: "Snack Squad", slug: "snack-squad", description: "Our top curated bestseller snacks loved across India.", image: "/aloo_tandoori-removebg-preview.png", sortOrder: 1 },
  { name: "Banana Chips", slug: "banana-chips", description: "Crispy Nendran banana chips fried in 100% pure coconut oil.", image: "/banana_chips.jpg", sortOrder: 2 },
  { name: "Potato Chips", slug: "potato-chips", description: "Wafer thin handpicked potatoes seasoned with authentic Indian spices.", image: "/masala_munch-removebg-preview.png", sortOrder: 3 },
  { name: "Tapioca Chips", slug: "tapioca-chips", description: "Stick & wafer style crunchy organic tapioca tubers.", image: "/tapioca_chips.jpg", sortOrder: 4 },
  { name: "Mixture", slug: "mixture", description: "Classic South Indian savory mixtures with roasted peanuts & spices.", image: "/murukku_chips.jpg", sortOrder: 5 },
  { name: "Murukku", slug: "murukku", description: "Traditional butter murukku spirals & spicy hand murukku.", image: "/murukku_chips.jpg", sortOrder: 6 },
  { name: "Pakoda", slug: "pakoda", description: "Sesame ribbon pakoda, onion crisp pakoda & tea savouries.", image: "/murukku_chips.jpg", sortOrder: 7 },
  { name: "Chikkies", slug: "chikkies", description: "Traditional jaggery peanut chikki bars & crunchy buttons.", image: "/snack_box.jpg", sortOrder: 8 },
  { name: "Puffed Snacks", slug: "puffed-snacks", description: "Light spicy puffed rice crunch & corn puffs.", image: "/masala_munch-removebg-preview.png", sortOrder: 9 },
  { name: "Halwa", slug: "halwa", description: "Authentic Kerala black jaggery, elaneer & wheat halwa.", image: "/heritage_story.jpg", sortOrder: 10 },
  { name: "Varkey", slug: "varkey", description: "Ooty special sweet crusty butter varkey biscuits.", image: "/snack_box.jpg", sortOrder: 11 },
];

const seedProducts = async (catMap) => {
  const products = [
    // --- BANANA CHIPS ---
    {
      name: "Classic Kerala Banana Chips",
      slug: "classic-kerala-banana-chips",
      sku: "A1-BAN-01",
      shortDescription: "Ultra thin wafer-style Nendran banana chips fried in coconut oil.",
      description: "Made from fresh raw Nendran bananas sourced directly from Kerala farms, sliced ultra-thin and deep fried in 100% cold-pressed coconut oil with sea salt.",
      brand: "A1 Chips",
      category: catMap["banana-chips"],
      images: ["/banana_chips.jpg"],
      thumbnail: "/banana_chips.jpg",
      variants: [
        { weight: "100g", sku: "A1-BAN-100", price: 75, compareAtPrice: 85, stock: 150 },
        { weight: "200g", sku: "A1-BAN-200", price: 140, compareAtPrice: 160, stock: 250 },
        { weight: "500g", sku: "A1-BAN-500", price: 320, compareAtPrice: 370, stock: 120 },
      ],
      ingredients: ["Nendran Banana", "Pure Coconut Oil", "Turmeric", "Sea Salt"],
      allergens: ["None"],
      price: 140,
      compareAtPrice: 160,
      weight: "200g",
      stock: 250,
      rating: 4.9,
      reviewCount: 512,
      isFeatured: true,
      isBestseller: true,
      spiceLevel: "Mild",
      flavourProfile: "Salty Coconut",
      texture: "Crispy Wafer",
      bgGradient: "radial-gradient(circle at 65% 45%, #D4A017 0%, #8B6508 55%, #4A3500 100%)",
      glowColor: "rgba(255, 215, 0, 0.45)",
      accentColor: "#FFE57F",
      tags: ["banana", "kerala", "coconut oil", "bestseller"],
    },
    {
      name: "Banana Chips Spicy Garlic",
      slug: "banana-chips-spicy-garlic",
      sku: "A1-BAN-02",
      shortDescription: "Garlic & fiery chilli tossed crispy banana chips.",
      description: "Crispy banana slices dusted with roasted garlic powder, red chilli flakes, and Himalayan pink salt.",
      brand: "A1 Chips",
      category: catMap["banana-chips"],
      images: ["/banana_chips.jpg"],
      thumbnail: "/banana_chips.jpg",
      variants: [
        { weight: "100g", sku: "A1-BANG-100", price: 80, compareAtPrice: 90, stock: 100 },
        { weight: "200g", sku: "A1-BANG-200", price: 150, compareAtPrice: 170, stock: 180 },
      ],
      ingredients: ["Raw Banana", "Coconut Oil", "Garlic Powder", "Red Chilli", "Salt"],
      allergens: ["None"],
      price: 150,
      compareAtPrice: 170,
      weight: "200g",
      stock: 180,
      rating: 4.8,
      reviewCount: 230,
      isBestseller: true,
      spiceLevel: "Spicy",
      flavourProfile: "Garlic Chilli",
      texture: "Crispy",
      tags: ["banana", "garlic", "spicy"],
    },
    {
      name: "Jackfruit Chips",
      slug: "jackfruit-chips",
      sku: "A1-JACK-01",
      shortDescription: "Authentic Kerala raw jackfruit strips fried in coconut oil.",
      description: "Handpicked raw jackfruit slices deep fried in pure coconut oil with sea salt. Distinct natural aroma and intense crunch.",
      brand: "A1 Chips",
      category: catMap["banana-chips"],
      images: ["/banana_chips.jpg"],
      thumbnail: "/banana_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-JACK-200", price: 160, compareAtPrice: 180, stock: 90 },
      ],
      ingredients: ["Raw Jackfruit", "Coconut Oil", "Salt"],
      allergens: ["None"],
      price: 160,
      compareAtPrice: 180,
      weight: "200g",
      stock: 90,
      rating: 4.9,
      reviewCount: 180,
      spiceLevel: "Mild",
      flavourProfile: "Earthy Savory",
      texture: "Hard Crunch",
      tags: ["jackfruit", "kerala", "authentic"],
    },

    // --- POTATO CHIPS ---
    {
      name: "Masala Munch Potato Chips",
      slug: "masala-munch-potato-chips",
      sku: "A1-MASALA-01",
      shortDescription: "Bold & Fiery Spice Potato Chips",
      description: "Crafted with handpicked premium potatoes sliced wafer-thin and tossed in our secret Coimbatore secret spice blend. Fiery, crunchy, and irresistibly delicious.",
      brand: "A1 Chips",
      category: catMap["potato-chips"],
      images: ["/masala_munch-removebg-preview.png", "/banana_chips.jpg"],
      thumbnail: "/masala_munch-removebg-preview.png",
      variants: [
        { weight: "100g", sku: "A1-MASALA-100", price: 65, compareAtPrice: 75, stock: 150 },
        { weight: "200g", sku: "A1-MASALA-200", price: 120, compareAtPrice: 140, stock: 200 },
        { weight: "500g", sku: "A1-MASALA-500", price: 280, compareAtPrice: 320, stock: 80 },
      ],
      ingredients: ["Fresh Potatoes", "Vegetable Oil", "Red Chilli", "Coriander", "Cumin", "Salt", "Amchur"],
      allergens: ["None"],
      price: 120,
      compareAtPrice: 140,
      weight: "200g",
      stock: 200,
      rating: 4.9,
      reviewCount: 342,
      isFeatured: true,
      isBestseller: true,
      spiceLevel: "Spicy",
      flavourProfile: "Bold Spicy & Tangy",
      texture: "Ultra Crunchy",
      bgGradient: "radial-gradient(circle at 65% 45%, #F05A00 0%, #B83500 55%, #6B1D00 100%)",
      glowColor: "rgba(255, 120, 30, 0.45)",
      accentColor: "#FFC02D",
      tags: ["potato", "spicy", "masala", "bestseller"],
    },
    {
      name: "Aloo Tandoori Chips",
      slug: "aloo-tandoori-chips",
      sku: "A1-TANDOORI-01",
      shortDescription: "Smoky & Tangy Roast Potato Chips",
      description: "Inspired by authentic clay oven tandoori spices. Blended with roasted garlic, smoked paprika, and a hint of lemon twist.",
      brand: "A1 Chips",
      category: catMap["potato-chips"],
      images: ["/aloo_tandoori-removebg-preview.png"],
      thumbnail: "/aloo_tandoori-removebg-preview.png",
      variants: [
        { weight: "100g", sku: "A1-TAND-100", price: 70, compareAtPrice: 80, stock: 90 },
        { weight: "200g", sku: "A1-TAND-200", price: 130, compareAtPrice: 150, stock: 140 },
      ],
      ingredients: ["Potatoes", "Coconut Oil", "Tandoori Spices", "Smoked Paprika", "Garlic Powder", "Rock Salt"],
      allergens: ["None"],
      price: 130,
      compareAtPrice: 150,
      weight: "200g",
      stock: 140,
      rating: 4.7,
      reviewCount: 195,
      isFeatured: true,
      isBestseller: true,
      spiceLevel: "Spicy",
      flavourProfile: "Smoky Tandoori",
      texture: "Crunchy Wave",
      bgGradient: "radial-gradient(circle at 65% 45%, #B81922 0%, #70090D 55%, #3C0305 100%)",
      glowColor: "rgba(255, 65, 80, 0.45)",
      accentColor: "#FF9E79",
      tags: ["tandoori", "smoky", "spicy"],
    },
    {
      name: "Cream & Onion Potato Chips",
      slug: "cream-onion-potato-chips",
      sku: "A1-CREAM-01",
      shortDescription: "Creamy & Herb Fresh Potato Chips",
      description: "Infused with real sour cream, spring onions, and delicate garden herbs. Smooth, savory, and cooked to a crisp golden crunch.",
      brand: "A1 Chips",
      category: catMap["potato-chips"],
      images: ["/cream_onion-removebg-preview.png"],
      thumbnail: "/cream_onion-removebg-preview.png",
      variants: [
        { weight: "100g", sku: "A1-CREAM-100", price: 65, compareAtPrice: 75, stock: 120 },
        { weight: "200g", sku: "A1-CREAM-200", price: 120, compareAtPrice: 140, stock: 180 },
      ],
      ingredients: ["Potatoes", "Refined Edible Oil", "Milk Solids", "Onion Powder", "Parsley", "Sea Salt"],
      allergens: ["Contains Milk Products"],
      price: 120,
      compareAtPrice: 140,
      weight: "200g",
      stock: 180,
      rating: 4.8,
      reviewCount: 289,
      isFeatured: true,
      isBestseller: true,
      spiceLevel: "Mild",
      flavourProfile: "Creamy & Herby",
      texture: "Light Crisp",
      bgGradient: "radial-gradient(circle at 65% 45%, #279A49 0%, #135A28 55%, #0B3516 100%)",
      glowColor: "rgba(65, 220, 115, 0.45)",
      accentColor: "#8FFF70",
      tags: ["cream", "onion", "mild", "bestseller"],
    },

    // --- TAPIOCA CHIPS ---
    {
      name: "Spiced Tapioca Sticks",
      slug: "spiced-tapioca-sticks",
      sku: "A1-TAPIOCA-01",
      shortDescription: "Crunchy Spicy Stick Style Tapioca",
      description: "High quality organic tapioca tubers cut into thin sticks, fried crisp and seasoned with fiery red pepper powder and asafoetida.",
      brand: "A1 Chips",
      category: catMap["tapioca-chips"],
      images: ["/tapioca_chips.jpg"],
      thumbnail: "/tapioca_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-TAP-200", price: 110, compareAtPrice: 130, stock: 160 },
        { weight: "500g", sku: "A1-TAP-500", price: 260, compareAtPrice: 300, stock: 70 },
      ],
      ingredients: ["Tapioca Tuber", "Vegetable Oil", "Red Chilli Powder", "Asafoetida", "Salt"],
      allergens: ["None"],
      price: 110,
      compareAtPrice: 130,
      weight: "200g",
      stock: 160,
      rating: 4.8,
      reviewCount: 142,
      isBestseller: true,
      spiceLevel: "Spicy",
      flavourProfile: "Hot & Crunchy",
      texture: "Hard Crunch",
      tags: ["tapioca", "sticks", "spicy"],
    },
    {
      name: "Tapioca Wafers Salted",
      slug: "tapioca-wafers-salted",
      sku: "A1-TAP-02",
      shortDescription: "Wafer thin salted cassava starch tapioca chips.",
      description: "Sliced tapioca wafers lightly salted to enhance natural cassava starch crunch.",
      brand: "A1 Chips",
      category: catMap["tapioca-chips"],
      images: ["/tapioca_chips.jpg"],
      thumbnail: "/tapioca_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-TAPS-200", price: 110, compareAtPrice: 130, stock: 140 },
      ],
      ingredients: ["Tapioca", "Oil", "Sea Salt"],
      allergens: ["None"],
      price: 110,
      compareAtPrice: 130,
      weight: "200g",
      stock: 140,
      rating: 4.7,
      reviewCount: 95,
      spiceLevel: "Mild",
      flavourProfile: "Lightly Salted",
      texture: "Crispy Wafers",
      tags: ["tapioca", "salted"],
    },

    // --- MIXTURE ---
    {
      name: "Country Mixture Classic",
      slug: "country-mixture-classic",
      sku: "A1-MIX-01",
      shortDescription: "Traditional South Indian mixture with roasted peanuts & curry leaves.",
      description: "Blend of sev, boondi, fried peanuts, roasted gram, and aromatic curry leaves tossed in asafoetida & chilli.",
      brand: "A1 Chips",
      category: catMap["mixture"],
      images: ["/murukku_chips.jpg"],
      thumbnail: "/murukku_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-MIX-200", price: 105, compareAtPrice: 125, stock: 220 },
        { weight: "500g", sku: "A1-MIX-500", price: 250, compareAtPrice: 290, stock: 100 },
      ],
      ingredients: ["Gram Flour", "Peanuts", "Fried Gram", "Curry Leaves", "Chilli", "Asafoetida", "Salt"],
      allergens: ["Contains Peanuts"],
      price: 105,
      compareAtPrice: 125,
      weight: "200g",
      stock: 220,
      rating: 4.9,
      reviewCount: 410,
      isBestseller: true,
      spiceLevel: "Medium",
      flavourProfile: "Savory & Nutty",
      texture: "Mixed Crunch",
      tags: ["mixture", "peanuts", "south indian"],
    },
    {
      name: "Garlic Mixture",
      slug: "garlic-mixture",
      sku: "A1-MIX-02",
      shortDescription: "Aromatic fried garlic pod infused savory mixture.",
      description: "Crispy sev and boondi blended with whole fried crushed garlic pods, red chilli, and roasted spices.",
      brand: "A1 Chips",
      category: catMap["mixture"],
      images: ["/murukku_chips.jpg"],
      thumbnail: "/murukku_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-GMIX-200", price: 115, compareAtPrice: 135, stock: 130 },
      ],
      ingredients: ["Gram Flour", "Garlic Pods", "Peanuts", "Chilli", "Salt"],
      allergens: ["Contains Peanuts"],
      price: 115,
      compareAtPrice: 135,
      weight: "200g",
      stock: 130,
      rating: 4.8,
      reviewCount: 205,
      spiceLevel: "Spicy",
      flavourProfile: "Garlic Savory",
      texture: "Mixed Crunch",
      tags: ["garlic", "mixture", "spicy"],
    },

    // --- MURUKKU ---
    {
      name: "Butter Murukku Crunch",
      slug: "butter-murukku-crunch",
      sku: "A1-MURUKKU-01",
      shortDescription: "Melt-in-mouth Traditional Butter Murukku",
      description: "Authentic South Indian rice flour and urad dal spirals enriched with generous dollops of fresh butter and cumin seeds.",
      brand: "A1 Chips",
      category: catMap["murukku"],
      images: ["/murukku_chips.jpg"],
      thumbnail: "/murukku_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-MUR-200", price: 115, compareAtPrice: 135, stock: 190 },
        { weight: "500g", sku: "A1-MUR-500", price: 270, compareAtPrice: 310, stock: 85 },
      ],
      ingredients: ["Rice Flour", "Urad Dal Flour", "Pure Butter", "Cumin Seeds", "Salt", "Refined Oil"],
      allergens: ["Contains Dairy"],
      price: 115,
      compareAtPrice: 135,
      weight: "200g",
      stock: 190,
      rating: 4.9,
      reviewCount: 220,
      isFeatured: true,
      isBestseller: true,
      spiceLevel: "Mild",
      flavourProfile: "Buttery & Savory",
      texture: "Brittle Melt",
      tags: ["murukku", "butter", "south indian"],
    },
    {
      name: "Hand Murukku (Kai Murukku)",
      slug: "hand-murukku",
      sku: "A1-KMUR-01",
      shortDescription: "Hand-twisted crunchy traditional rice flour murukku.",
      description: "Artisanal hand-twisted Kai Murukku cooked in pure coconut oil with white sesame seeds.",
      brand: "A1 Chips",
      category: catMap["murukku"],
      images: ["/murukku_chips.jpg"],
      thumbnail: "/murukku_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-KMUR-200", price: 130, compareAtPrice: 150, stock: 120 },
      ],
      ingredients: ["Raw Rice Flour", "Urad Dal", "Sesame Seeds", "Coconut Oil", "Salt"],
      allergens: ["Contains Sesame"],
      price: 130,
      compareAtPrice: 150,
      weight: "200g",
      stock: 120,
      rating: 4.9,
      reviewCount: 175,
      spiceLevel: "Mild",
      flavourProfile: "Sesame & Salted",
      texture: "Hard Crisp",
      tags: ["kai murukku", "artisanal"],
    },

    // --- PAKODA ---
    {
      name: "Sesame Ribbon Pakoda",
      slug: "sesame-ribbon-pakoda",
      sku: "A1-PAK-01",
      shortDescription: "Crispy ribbon style gram flour strips with roasted sesame.",
      description: "Golden ribbon pakoda strips flavored with crushed ajwain, sesame, chilli, and rock salt.",
      brand: "A1 Chips",
      category: catMap["pakoda"],
      images: ["/murukku_chips.jpg"],
      thumbnail: "/murukku_chips.jpg",
      variants: [
        { weight: "200g", sku: "A1-PAK-200", price: 110, compareAtPrice: 130, stock: 170 },
      ],
      ingredients: ["Gram Flour", "Rice Flour", "Sesame Seeds", "Ajwain", "Chilli", "Salt"],
      allergens: ["Contains Sesame"],
      price: 110,
      compareAtPrice: 130,
      weight: "200g",
      stock: 170,
      rating: 4.8,
      reviewCount: 160,
      spiceLevel: "Medium",
      flavourProfile: "Ajwain Savory",
      texture: "Crispy Ribbon",
      tags: ["pakoda", "ribbon", "sesame"],
    },

    // --- CHIKKIES ---
    {
      name: "Peanut Chikki Bar Candy",
      slug: "peanut-chikki-bar-candy",
      sku: "A1-CHK-01",
      shortDescription: "Roasted peanut & organic jaggery chikki bars.",
      description: "Premium roasted bold peanuts combined with clarified organic jaggery syrup. Sweet, crunchy, and rich in natural protein.",
      brand: "A1 Chips",
      category: catMap["chikkies"],
      images: ["/snack_box.jpg"],
      thumbnail: "/snack_box.jpg",
      variants: [
        { weight: "200g", sku: "A1-CHK-200", price: 95, compareAtPrice: 110, stock: 210 },
      ],
      ingredients: ["Roasted Peanuts", "Organic Jaggery", "Liquid Glucose", "Cardamom"],
      allergens: ["Contains Peanuts"],
      price: 95,
      compareAtPrice: 110,
      weight: "200g",
      stock: 210,
      rating: 4.9,
      reviewCount: 310,
      isBestseller: true,
      spiceLevel: "Mild",
      flavourProfile: "Jaggery Nutty",
      texture: "Hard Brittle",
      tags: ["chikki", "peanut", "jaggery"],
    },

    // --- PUFFED SNACKS ---
    {
      name: "Spicy Puffed Rice Crunch",
      slug: "spicy-puffed-rice-crunch",
      sku: "A1-PUF-01",
      shortDescription: "Light spicy puffed rice seasoned with peanuts and garlic.",
      description: "Ultra light roasted puffed rice tossed with peanuts, fried curry leaves, and spicy red pepper powder.",
      brand: "A1 Chips",
      category: catMap["puffed-snacks"],
      images: ["/masala_munch-removebg-preview.png"],
      thumbnail: "/masala_munch-removebg-preview.png",
      variants: [
        { weight: "150g", sku: "A1-PUF-150", price: 60, compareAtPrice: 70, stock: 180 },
      ],
      ingredients: ["Puffed Rice", "Peanuts", "Curry Leaves", "Chilli", "Salt"],
      allergens: ["Contains Peanuts"],
      price: 60,
      compareAtPrice: 70,
      weight: "150g",
      stock: 180,
      rating: 4.7,
      reviewCount: 110,
      spiceLevel: "Medium",
      flavourProfile: "Spicy Light",
      texture: "Puffed Airy",
      tags: ["puffed", "rice", "light"],
    },

    // --- HALWA ---
    {
      name: "Kerala Black Jaggery Halwa",
      slug: "kerala-black-jaggery-halwa",
      sku: "A1-HAL-01",
      shortDescription: "Authentic dark palm jaggery & coconut oil halwa.",
      description: "Rich traditional Kerala halwa slow cooked with dark palm jaggery, pure ghee, and roasted cashew nuts.",
      brand: "A1 Chips",
      category: catMap["halwa"],
      images: ["/heritage_story.jpg"],
      thumbnail: "/heritage_story.jpg",
      variants: [
        { weight: "250g", sku: "A1-HAL-250", price: 180, compareAtPrice: 200, stock: 95 },
        { weight: "500g", sku: "A1-HAL-500", price: 350, compareAtPrice: 390, stock: 50 },
      ],
      ingredients: ["Palm Jaggery", "Coconut Oil", "Pure Ghee", "Wheat Starch", "Cashews", "Cardamom"],
      allergens: ["Contains Tree Nuts, Ghee"],
      price: 180,
      compareAtPrice: 200,
      weight: "250g",
      stock: 95,
      rating: 4.9,
      reviewCount: 290,
      isBestseller: true,
      spiceLevel: "Mild",
      flavourProfile: "Jaggery Ghee",
      texture: "Soft Chewy",
      tags: ["halwa", "jaggery", "kerala"],
    },

    // --- VARKEY ---
    {
      name: "Ooty Special Sweet Varkey",
      slug: "ooty-special-sweet-varkey",
      sku: "A1-VAR-01",
      shortDescription: "Flaky crusty butter varkey biscuits from Ooty hills.",
      description: "Handcrafted crusty flaky bakery biscuits layered with pure butter and baked golden in traditional hill station wood ovens.",
      brand: "A1 Chips",
      category: catMap["varkey"],
      images: ["/snack_box.jpg"],
      thumbnail: "/snack_box.jpg",
      variants: [
        { weight: "250g", sku: "A1-VAR-250", price: 140, compareAtPrice: 160, stock: 140 },
      ],
      ingredients: ["Refined Wheat Flour", "Pure Butter", "Sugar", "Cardamom"],
      allergens: ["Contains Gluten, Dairy"],
      price: 140,
      compareAtPrice: 160,
      weight: "250g",
      stock: 140,
      rating: 4.9,
      reviewCount: 380,
      isBestseller: true,
      spiceLevel: "Mild",
      flavourProfile: "Sweet Buttery",
      texture: "Flaky Crust",
      tags: ["varkey", "ooty", "sweet"],
    },
  ];

  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`[Seed] Created ${inserted.length} products.`);
  return inserted;
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/a1_chips_db";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log("[Seed] Connected to MongoDB");

    // 1. Seed Users
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("Admin@123456", salt);
    const customerPassword = await bcrypt.hash("Customer@123456", salt);

    const admin = await User.create({
      name: "A1 Chips Master Admin",
      email: "admin@a1chips.com",
      phone: "+919876543210",
      passwordHash: adminPassword,
      role: "admin",
      isVerified: true,
    });

    const demoCustomer = await User.create({
      name: "Ramesh Kumar",
      email: "ramesh@example.com",
      phone: "+919812345678",
      passwordHash: customerPassword,
      role: "customer",
      isVerified: true,
    });

    console.log(`[Seed] Created Admin (${admin.email}) and Customer (${demoCustomer.email})`);

    // 2. Seed Categories
    await Category.deleteMany({});
    const createdCats = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCats.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed Products
    const products = await seedProducts(catMap);

    // 4. Seed Coupons
    await Coupon.deleteMany({});
    await Coupon.create([
      {
        code: "CRUNCH10",
        type: "percentage",
        value: 10,
        minimumOrder: 299,
        maximumDiscount: 100,
        isActive: true,
      },
      {
        code: "WELCOME100",
        type: "fixed",
        value: 100,
        minimumOrder: 599,
        isActive: true,
      },
      {
        code: "FREESHIP",
        type: "free_shipping",
        value: 0,
        minimumOrder: 399,
        isActive: true,
      },
    ]);
    console.log("[Seed] Created 3 active promo coupons");

    // 5. Seed Bundles
    await Bundle.deleteMany({});
    await Bundle.create([
      { name: "Snack Box — 4 Packs", boxSize: 4, price: 349, discountPercentage: 15, isActive: true },
      { name: "Snack Box — 6 Packs", boxSize: 6, price: 499, discountPercentage: 20, isActive: true },
      { name: "Mega Party Box — 8 Packs", boxSize: 8, price: 649, discountPercentage: 25, isActive: true },
    ]);
    console.log("[Seed] Created 3 Snack Box bundles");

    // 6. Seed Reviews
    await Review.deleteMany({});
    const firstProduct = products[0];
    await Review.create([
      {
        product: firstProduct._id,
        user: demoCustomer._id,
        userName: "Ramesh Kumar",
        rating: 5,
        title: "Incredible crunch & authentic spicy taste!",
        comment: "Ordered the Masala Munch chips and they arrived within 2 days in Coimbatore. Super fresh and crispy!",
        verifiedPurchase: true,
        status: "approved",
      },
      {
        product: firstProduct._id,
        user: demoCustomer._id,
        userName: "Pooja Sharma",
        rating: 5,
        title: "Best teatime snack",
        comment: "The coconut oil flavor is subtle and not greasy at all. Will definitely order the 1kg pack next time.",
        verifiedPurchase: true,
        status: "approved",
      },
    ]);
    console.log("[Seed] Created sample verified customer reviews");

    // 7. Seed Site Settings
    await SiteSetting.deleteMany({});
    await SiteSetting.create({
      announcementBar: "🔥 FREE Shipping on all orders above ₹499! Use Code: CRUNCH10 for 10% OFF",
      announcementActive: true,
      freeShippingThreshold: 499,
      baseShippingFee: 50,
      codFee: 30,
      codEnabled: true,
    });
    console.log("[Seed] Site settings created");

    console.log("[Seed] Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
