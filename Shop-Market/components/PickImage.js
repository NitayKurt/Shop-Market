const categoryImages = {
  'מוצרי חלב': require('../assets/milk.png'),
  'פירות וירקות': require('../assets/fruits_and_vegetables.png'),
  'שימורים': require('../assets/canned_goods.png'),
  'סלטים וממרחים': require('../assets/salads.png'),
  'דגים ובשר': require('../assets/meat_and_fish.png'),
  'מוצרים כלליים': require('../assets/general_products.png'),
  'שתייה': require('../assets/drinks.png'),
  'חומרי ניקוי וחד פעמי': require('../assets/cleaning_products_and_disposables.png'),
  'טיפוח והיגיינה אישית': require('../assets/personal_care_and_hygiene.png'),
  'אגוזים': require('../assets/nuts.png'),
  'קפואים': require('../assets/frozen_products.png'),
};

export default function PickImage(hebrewTitle) {
  return categoryImages[hebrewTitle] || require('../assets/general_products.png');
};