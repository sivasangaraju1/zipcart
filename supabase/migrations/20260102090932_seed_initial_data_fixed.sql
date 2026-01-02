/*
  # Seed Data for Zipcart - Fixed
  
  Populates the database with initial test data for all major entities.
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
  ('Fresh Produce', 'fresh-produce', 'Fresh fruits and vegetables', 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg', 1, true),
  ('Dairy & Eggs', 'dairy-eggs', 'Milk, cheese, eggs and dairy products', 'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg', 2, true),
  ('Meat & Seafood', 'meat-seafood', 'Fresh meat and seafood', 'https://images.pexels.com/photos/3688/food-dinner-lunch-meal.jpg', 3, true),
  ('Bakery', 'bakery', 'Fresh bread and baked goods', 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg', 4, true),
  ('Snacks & Candy', 'snacks-candy', 'Chips, cookies, and candy', 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg', 5, true),
  ('Beverages', 'beverages', 'Drinks, juices, and sodas', 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg', 6, true),
  ('Frozen Foods', 'frozen-foods', 'Frozen meals and ice cream', 'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg', 7, true),
  ('Pantry Staples', 'pantry-staples', 'Pasta, rice, and canned goods', 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg', 8, true),
  ('Health & Personal Care', 'health-personal-care', 'Health and beauty products', 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', 9, true),
  ('Household Essentials', 'household-essentials', 'Cleaning supplies and paper products', 'https://images.pexels.com/photos/4099471/pexels-photo-4099471.jpeg', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Products (using category slugs to find IDs)
INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Organic Bananas', 'organic-bananas', 'Fresh organic bananas', 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg', 0.99, 'lb', false, 'food', true
FROM categories c WHERE c.slug = 'fresh-produce'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Avocados', 'avocados', 'Fresh Hass avocados', 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg', 1.49, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'fresh-produce'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Cherry Tomatoes', 'cherry-tomatoes', 'Sweet cherry tomatoes', 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg', 3.99, 'lb', false, 'food', true
FROM categories c WHERE c.slug = 'fresh-produce'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Baby Spinach', 'baby-spinach', 'Fresh organic baby spinach', 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg', 4.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'fresh-produce'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Whole Milk', 'whole-milk', 'Fresh whole milk 1 gallon', 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg', 4.29, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'dairy-eggs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Large Eggs', 'large-eggs', 'Grade A large eggs dozen', 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg', 3.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'dairy-eggs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Cheddar Cheese', 'cheddar-cheese', 'Sharp cheddar cheese 8oz', 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg', 5.49, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'dairy-eggs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Greek Yogurt', 'greek-yogurt', 'Plain Greek yogurt 32oz', 'https://images.pexels.com/photos/1327698/pexels-photo-1327698.jpeg', 5.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'dairy-eggs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Chicken Breast', 'chicken-breast', 'Boneless skinless chicken breast', 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg', 6.99, 'lb', false, 'food', true
FROM categories c WHERE c.slug = 'meat-seafood'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Ground Beef', 'ground-beef', 'Lean ground beef 80/20', 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg', 5.99, 'lb', false, 'food', true
FROM categories c WHERE c.slug = 'meat-seafood'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Atlantic Salmon', 'atlantic-salmon', 'Fresh Atlantic salmon fillet', 'https://images.pexels.com/photos/3296394/pexels-photo-3296394.jpeg', 12.99, 'lb', false, 'food', true
FROM categories c WHERE c.slug = 'meat-seafood'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Sourdough Bread', 'sourdough-bread', 'Artisan sourdough bread', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', 4.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'bakery'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Croissants', 'croissants', 'Butter croissants 6 pack', 'https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg', 6.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'bakery'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Bagels', 'bagels', 'Plain bagels 6 pack', 'https://images.pexels.com/photos/2021660/pexels-photo-2021660.jpeg', 4.49, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'bakery'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Potato Chips', 'potato-chips', 'Classic potato chips family size', 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', 4.49, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'snacks-candy'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Chocolate Bar', 'chocolate-bar', 'Milk chocolate bar', 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg', 1.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'snacks-candy'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Trail Mix', 'trail-mix', 'Mixed nuts and dried fruit', 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', 5.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'snacks-candy'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Orange Juice', 'orange-juice', 'Fresh squeezed orange juice 64oz', 'https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg', 5.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'beverages'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Bottled Water', 'bottled-water', 'Spring water 24 pack', 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg', 6.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'beverages'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Coffee Beans', 'coffee-beans', 'Premium coffee beans 12oz', 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg', 12.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'beverages'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Frozen Pizza', 'frozen-pizza', 'Pepperoni pizza', 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg', 7.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'frozen-foods'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Ice Cream', 'ice-cream', 'Vanilla ice cream pint', 'https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg', 5.49, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'frozen-foods'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Spaghetti Pasta', 'spaghetti-pasta', 'Spaghetti pasta 16oz', 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', 1.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'pantry-staples'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'White Rice', 'white-rice', 'Long grain white rice 5lb', 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg', 6.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'pantry-staples'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Olive Oil', 'olive-oil', 'Extra virgin olive oil 750ml', 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg', 14.99, 'each', false, 'food', true
FROM categories c WHERE c.slug = 'pantry-staples'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Toothpaste', 'toothpaste', 'Whitening toothpaste', 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg', 4.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'health-personal-care'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Shampoo', 'shampoo', 'Moisturizing shampoo 16oz', 'https://images.pexels.com/photos/4202481/pexels-photo-4202481.jpeg', 7.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'health-personal-care'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Paper Towels', 'paper-towels', 'Paper towels 6 roll pack', 'https://images.pexels.com/photos/4099239/pexels-photo-4099239.jpeg', 12.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'household-essentials'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Dish Soap', 'dish-soap', 'Liquid dish soap 24oz', 'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg', 3.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'household-essentials'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, image_url, base_price, unit, is_taxable, tax_category, is_active)
SELECT c.id, 'Trash Bags', 'trash-bags', 'Kitchen trash bags 50 count', 'https://images.pexels.com/photos/4099120/pexels-photo-4099120.jpeg', 9.99, 'each', true, 'non_food', true
FROM categories c WHERE c.slug = 'household-essentials'
ON CONFLICT (slug) DO NOTHING;

-- Insert Stores
INSERT INTO stores (name, type, address, city, state, zip_code, latitude, longitude, delivery_radius_miles, is_active) VALUES
  ('Zipcart Manhattan Downtown', 'dark_store', '123 Broadway', 'New York', 'NY', '10007', 40.7128, -74.0060, 3.0, true),
  ('Zipcart Brooklyn Heights', 'dark_store', '456 Court St', 'Brooklyn', 'NY', '11201', 40.6935, -73.9910, 3.0, true),
  ('Zipcart SF Mission', 'dark_store', '789 Valencia St', 'San Francisco', 'CA', '94110', 37.7599, -122.4216, 3.0, true),
  ('Zipcart LA West Hollywood', 'dark_store', '321 Santa Monica Blvd', 'Los Angeles', 'CA', '90046', 34.0900, -118.3617, 3.0, true),
  ('Zipcart Chicago Loop', 'dark_store', '654 State St', 'Chicago', 'IL', '60605', 41.8781, -87.6298, 3.0, true)
ON CONFLICT DO NOTHING;

-- Insert Inventory for all products across all stores
INSERT INTO inventory (product_id, store_id, quantity, reserved_quantity, reorder_level)
SELECT p.id, s.id, 100, 0, 20
FROM products p
CROSS JOIN stores s
ON CONFLICT (product_id, store_id) DO NOTHING;

-- Insert Sample Promotions
INSERT INTO promotions (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, valid_from, valid_until, usage_limit, is_active) VALUES
  ('WELCOME10', '10% off your first order', 'percentage', 10.00, 20.00, 15.00, '2024-01-01', '2025-12-31', 1000, true),
  ('SAVE5', '$5 off orders over $30', 'fixed_amount', 5.00, 30.00, 5.00, '2024-01-01', '2025-12-31', NULL, true),
  ('FREEDEL', 'Free delivery on any order', 'free_delivery', 0.00, 0.00, NULL, '2024-01-01', '2025-12-31', NULL, true)
ON CONFLICT (code) DO NOTHING;