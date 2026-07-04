-- Seed default blog posts matching the website's original static articles
DO $$
DECLARE
  hormonal_id uuid;
  gut_id uuid;
  nutrition_id uuid;
BEGIN
  -- Get the category IDs based on their slugs
  SELECT id INTO hormonal_id FROM blog_categories WHERE slug = 'hormonal-health';
  SELECT id INTO gut_id FROM blog_categories WHERE slug = 'gut-health';
  SELECT id INTO nutrition_id FROM blog_categories WHERE slug = 'nutrition-tips';

  -- Insert the article: Understanding Your Cycle
  INSERT INTO blog_posts (title, slug, excerpt, content, category_id, featured_image_url, published_at, is_published, author_name)
  VALUES (
    'Understanding Your Cycle: A Nutritional Guide to Each Phase',
    'understanding-your-cycle-a-nutritional-guide',
    'Learn how to nourish your body through each phase of your menstrual cycle for optimal hormonal balance.',
    'Menstrual cycle health is a vital sign of overall female wellness. Nourishing your body dynamically through each phase of your cycle can help balance hormones, reduce PMS, and optimize energy levels. Here is a guide to supporting your hormones in all four cycle phases:

1. Menstrual Phase (Days 1-5): Warm, comforting foods like soups, stews, and herbal teas. Focus on iron-rich foods.
2. Follicular Phase (Days 6-13): Fresh, light foods, fermented foods, broccoli, sprouts, and seeds.
3. Ovulatory Phase (Days 14-17): High-fiber foods, quinoa, berries, leafy greens to assist with estrogen metabolism.
4. Luteal Phase (Days 18-28): Complex carbs, sweet potatoes, brown rice, healthy fats, magnesium-rich foods like dark chocolate to reduce cravings.',
    hormonal_id,
    'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800',
    '2024-12-01T10:00:00Z',
    true,
    'Teagan'
  ) ON CONFLICT (slug) DO NOTHING;

  -- Insert the article: The Gut-Skin Connection
  INSERT INTO blog_posts (title, slug, excerpt, content, category_id, featured_image_url, published_at, is_published, author_name)
  VALUES (
    'The Gut-Skin Connection: Why Your Skin Starts in the Gut',
    'the-gut-skin-connection-why-your-skin-starts',
    'Discover the science behind the gut-skin axis and how healing your microbiome can clear your complexion.',
    'Have you ever wondered why your skin flares up when your digestion is off? The answer lies in the gut-skin axis—a bidirectional communication channel between your digestive tract and skin.

When your gut microbiome is imbalanced (dysbiosis) or your gut lining is compromised (leaky gut), it can trigger systemic inflammation. This inflammation can manifest on your face as acne, eczema, psoriasis, or rosacea.

To heal your skin from the inside out, focus on these gut-loving practices:
- Incorporate prebiotic foods like onions, garlic, and bananas.
- Consume probiotic-rich fermented foods like sauerkraut and kefir.
- Limit processed sugars and refined carbohydrates.
- Manage stress levels, which directly affect gut health.',
    gut_id,
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    '2024-11-01T10:00:00Z',
    true,
    'Teagan'
  ) ON CONFLICT (slug) DO NOTHING;

  -- Insert the article: 5 Anti-Inflammatory Foods
  INSERT INTO blog_posts (title, slug, excerpt, content, category_id, featured_image_url, published_at, is_published, author_name)
  VALUES (
    '5 Anti-Inflammatory Foods Every Woman Should Eat Weekly',
    '5-anti-inflammatory-foods-every-woman-should-eat',
    'These powerful whole foods reduce systemic inflammation and support hormones, skin, and energy levels.',
    'Inflammation is at the root of most hormonal imbalances, gut discomfort, and skin disruptions. By introducing anti-inflammatory whole foods into your weekly meals, you can support your body''s natural healing processes.

Here are five key anti-inflammatory foods to prioritize:

1. Wild-caught Salmon: Packed with omega-3 fatty acids, which reduce inflammatory pathways.
2. Turmeric: Contains curcumin, a potent natural compound with proven anti-inflammatory properties.
3. Blueberries: High in antioxidants that protect cells from oxidative stress.
4. Leafy Greens: Spinach and kale contain vitamins A, C, and K, as well as minerals to support liver detoxification.
5. Avocado: High in monounsaturated fats and vitamin E to nourish the skin and balance blood sugar.',
    nutrition_id,
    'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800',
    '2024-11-15T10:00:00Z',
    true,
    'Teagan'
  ) ON CONFLICT (slug) DO NOTHING;
END $$;
