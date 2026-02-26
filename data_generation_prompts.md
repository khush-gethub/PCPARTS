
## Prompt 1: High-Level Product Schema Mapping

Use this prompt to explain the schema to the AI so it understands the relationships and field types.

**Prompt:**
> Please act as a data engineer. I need to generate realistic dummy data for a PC Hardware E-commerce store. 
> 
> Here is the schema structure you must follow:
> 
> 1. **Categories**: { _id: "cat_...", name: string }
> 2. **Brands**: { _id: "brand_...", name: string }
> 3. **Product**: { _id: "prod_...", category_id: string, brand_id: string, name: string, description: string, specs: Object }
> 4. **ProductVariant**: { _id: "var_...", product_id: string, name: string, sku: string, price: number, discount_price: number, stock_status: "in_stock"|"low_stock"|"out_of_stock", weight: number }
> 5. **Stock**: { _id: "stk_...", variant_id: string, quantity: number }
> 6. **ProductImage**: { _id: "img_...", product_id: string, image_url: string (URL to 400x400 image), position: number }
> 7. **BenchmarkTable** (For Storage/Performance): { _id: "bench_...", product_id: string, name: string, capacity: string, read_speed: number, write_speed: number, rating: number, reviews: number }
> 
> Relationships:
> - Product belongs to Category and Brand.
> - ProductVariant belongs to Product.
> - BenchmarkTable belongs to Product.
> - Stock and Image belong to Product or Variant.
> 
> Please acknowledge if you understand this structure.

---

## Prompt 2: Generating Categorized Components

Once the AI understands the schema, use this to generate specific product data.

**Prompt:**
> Generate **15 realistic products** for a specific category (e.g., "Graphics Cards,Ram,Processor,Storage,PSU,CPU,cooler,case,monitor,keyboard,mouse,headphone").
> 
> IMPORTANT: Use a **wide variety of different brands** (e.g., ASUS, MSI, Gigabyte, Zotac, Sapphire, etc.) to ensure a diverse catalog.
> 
> For each of the 15 products, provide:
> 1. A unique product ID (prod_[category]_X).
> 2. A realistic Brand ID (e.g., brand_msi).
> 3. A detailed, professional marketing description.
> 4. A JSON `specs` object relevant to the category.
> 5. One "Standard" Variant with a realistic price in INR.
> 6. Corresponding Stock (quantity 5-100) and a placeholder Image URL.
> 
> Format the response as a single valid JSON array tailored for a MongoDB insert.

---

## Prompt 3: Generating Benchmark and Detailed Tech Specs

Use this for components that require performance data.

**Prompt:**
> Generate 3 "NVMe SSD" products with full BenchmarkTable data.
> 
> Fields to include:
> - Product Name (e.g., Samsung 990 Pro).
> - capacity (e.g., "2TB").
> - read_speed (number in MB/s, e.g., 7450).
> - write_speed (number in MB/s, e.g., 6900).
> - rating (4.0 - 5.0).
> - price (realistic INR).
> 
> Also provide the base Product and ProductVariant records for these items so the system remains consistent.

---

## AI Best Practices for Generation
- **Currency**: Always use INR values (₹).
- **IDs**: Use predictable prefixes (cat_, brand_, prod_, var_, stk_).
- **Descriptions**: Aim for marketing-ready copy, not just placeholders.
- **Specs**: Ensure keys are consistent within a category (e.g., all CPUs should have "Cores" and "Threads").
