// E-commerce MongoDB Schema Creation Script
// Run this script in mongosh or MongoDB Compass Shell
// Usage: load("create_collections.js") or copy-paste content

const collections = [
  'users', 'addresses', 'categories', 'brands', 'products', 'product_variants',
  'stock', 'product_images', 'benchmarks', 'pc_builder_compatibility',
  'ready_made_pc', 'ready_made_pc_items', 'coupons', 'user_coupons',
  'cart', 'cart_items', 'orders', 'order_items', 'pdf_downloads'
];

// Helper to drop existing collections to ensure clean slate (Optional - comment out if safe mode needed)
collections.forEach(coll => {
  db.getCollection(coll).drop();
});

// 1. Users
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "name", "email", "password_"],
      properties: {
        user_id: { bsonType: "string", description: "UUID PK" },
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        password_: { bsonType: "string" },
        phone: { bsonType: "string" },
        role: { enum: ["user", "admin"], description: "Role enum" },
        created_at: { bsonType: "date" }
      }
    }
  }
});
db.users.createIndex({ "email": 1 }, { unique: true });

// 2. Addresses
db.createCollection("addresses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["address_id", "user_id"],
      properties: {
        address_id: { bsonType: "string", description: "UUID PK" },
        user_id: { bsonType: "string", description: "UUID FK" },
        line1: { bsonType: "string" },
        line2: { bsonType: "string" },
        city: { bsonType: "string" },
        state: { bsonType: "string" },
        pincode: { bsonType: "string" },
        country: { bsonType: "string" }
      }
    }
  }
});

// 3. Categories
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["category_id", "name"],
      properties: {
        category_id: { bsonType: "string", description: "UUID PK" },
        name: { bsonType: "string" }
      }
    }
  }
});

// 4. Brands
db.createCollection("brands", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["brand_id", "name"],
      properties: {
        brand_id: { bsonType: "string", description: "UUID PK" },
        name: { bsonType: "string" }
      }
    }
  }
});

// 5. Products
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "category_id", "brand_id", "name"],
      properties: {
        product_id: { bsonType: "string", description: "UUID PK" },
        category_id: { bsonType: "string", description: "UUID FK" },
        brand_id: { bsonType: "string", description: "UUID FK" },
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        specs: { bsonType: "object", description: "JSONB specs" }
      }
    }
  }
});

// 6. ProductVariants
db.createCollection("product_variants", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["variant_id", "product_id", "name", "sku", "price", "stock_status"],
      properties: {
        variant_id: { bsonType: "string", description: "UUID PK" },
        product_id: { bsonType: "string", description: "UUID FK" },
        name: { bsonType: "string" },
        sku: { bsonType: "string", description: "Unique SKU" },
        price: { bsonType: "int" },
        discount_price: { bsonType: ["int", "null"] },
        stock_status: { enum: ["in_stock", "low_stock", "out_of_stock"] },
        weight: { bsonType: ["int", "null"] }
      }
    }
  }
});
db.product_variants.createIndex({ "sku": 1 }, { unique: true });

// 7. Stock
db.createCollection("stock", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["stock_id", "variant_id", "quantity"],
      properties: {
        stock_id: { bsonType: "string", description: "UUID PK" },
        variant_id: { bsonType: "string", description: "UUID FK Unique" },
        quantity: { bsonType: "int" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.stock.createIndex({ "variant_id": 1 }, { unique: true });

// 8. ProductImages
db.createCollection("product_images", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["image_id", "product_id"],
      properties: {
        image_id: { bsonType: "string", description: "UUID PK" },
        product_id: { bsonType: "string", description: "UUID FK" },
        image_url: { bsonType: "string" },
        position: { bsonType: "int" }
      }
    }
  }
});

// 9. Benchmarks
db.createCollection("benchmarks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["benchmark_id", "product_id", "name"],
      properties: {
        benchmark_id: { bsonType: "string", description: "UUID PK" },
        product_id: { bsonType: "string", description: "UUID FK" },
        name: { bsonType: "string" },
        score: { bsonType: ["double", "int"] },
        details: { bsonType: "object", description: "JSONB details" }
      }
    }
  }
});

// 10. PCBuilderCompatibility
db.createCollection("pc_builder_compatibility", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["compat_id", "product_id", "compatible_with_product_id"],
      properties: {
        compat_id: { bsonType: "string", description: "UUID PK" },
        product_id: { bsonType: "string", description: "UUID FK" },
        compatible_with_product_id: { bsonType: "string", description: "UUID FK" },
        rule: { bsonType: "string" }
      }
    }
  }
});

// 11. ReadyMadePC
db.createCollection("ready_made_pc", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["pc_id", "name", "price"],
      properties: {
        pc_id: { bsonType: "string", description: "UUID PK" },
        name: { bsonType: "string" },
        price: { bsonType: "int" },
        category: { bsonType: "string" },
        image: { bsonType: "string" },
        Image2: { bsonType: "string" },
        Image3: { bsonType: "string" }
      }
    }
  }
});

// 12. ReadyMadePCItems
db.createCollection("ready_made_pc_items", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["item_id", "pc_id"],
      properties: {
        item_id: { bsonType: "string", description: "UUID PK" },
        pc_id: { bsonType: "string", description: "UUID FK" },
        product_id: { bsonType: "string", description: "UUID FK" },
        variant_id: { bsonType: "string", description: "UUID FK" }
      }
    }
  }
});

// 13. Coupons
db.createCollection("coupons", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["coupon_id", "code", "discount_value"],
      properties: {
        coupon_id: { bsonType: "string", description: "UUID PK" },
        code: { bsonType: "string", description: "Unique Code" },
        discount_value: { bsonType: "int" },
        min_order_amount: { bsonType: ["int", "null"] },
        expires_at: { bsonType: "date" },
        usage_limit: { bsonType: "int" },
        created_at: { bsonType: "date" }
      }
    }
  }
});
db.coupons.createIndex({ "code": 1 }, { unique: true });

// 14. UserCoupons
db.createCollection("user_coupons", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_coupon_id", "user_id", "coupon_id"],
      properties: {
        user_coupon_id: { bsonType: "string", description: "UUID PK" },
        user_id: { bsonType: "string", description: "UUID FK" },
        coupon_id: { bsonType: "string", description: "UUID FK" },
        used_at: { bsonType: "date" }
      }
    }
  }
});

// 15. Cart
db.createCollection("cart", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cart_id", "user_id"],
      properties: {
        cart_id: { bsonType: "string", description: "UUID PK" },
        user_id: { bsonType: "string", description: "UUID FK" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// 16. CartItems
db.createCollection("cart_items", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cart_item_id", "cart_id", "variant_id", "quantity"],
      properties: {
        cart_item_id: { bsonType: "string", description: "UUID PK" },
        cart_id: { bsonType: "string", description: "UUID FK" },
        variant_id: { bsonType: "string", description: "UUID FK" },
        quantity: { bsonType: "int" },
        price_snapshot: { bsonType: "int" }
      }
    }
  }
});

// 17. Orders
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["order_id", "user_id", "address_id", "total_price", "payment_status", "order_status"],
      properties: {
        order_id: { bsonType: "string", description: "UUID PK" },
        user_id: { bsonType: "string", description: "UUID FK" },
        address_id: { bsonType: "string", description: "UUID FK" },
        total_price: { bsonType: "int" },
        payment_status: { enum: ["pending", "paid", "failed"] },
        order_status: { enum: ["processing", "shipped", "delivered", "cancelled"] },
        payment_id: { bsonType: "string" },
        created_at: { bsonType: "date" }
      }
    }
  }
});

// 18. OrderItems
db.createCollection("order_items", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["order_item_id", "order_id", "variant_id", "product_name", "price", "quantity"],
      properties: {
        order_item_id: { bsonType: "string", description: "UUID PK" },
        order_id: { bsonType: "string", description: "UUID FK" },
        variant_id: { bsonType: "string", description: "UUID FK" },
        product_name: { bsonType: "string" },
        price: { bsonType: "int" },
        quantity: { bsonType: "int" }
      }
    }
  }
});

// 19. PDFDownloads
db.createCollection("pdf_downloads", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["pdf_id", "user_id", "order_id"],
      properties: {
        pdf_id: { bsonType: "string", description: "UUID PK" },
        user_id: { bsonType: "string", description: "UUID FK" },
        order_id: { bsonType: "string", description: "UUID FK" },
        pdf_url: { bsonType: "string" },
        created_at: { bsonType: "date" }
      }
    }
  }
});

print("Entities created successfully.");
