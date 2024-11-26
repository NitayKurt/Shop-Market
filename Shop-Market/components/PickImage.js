export default function PickImage(imageName) {
  
  switch (imageName) {
    case 'dairy_products':
      return require('../assets/milk.png');
    case 'fruits_and_vegetables':
      return require('../assets/fruits_and_vegetables.png');
    case 'canned_goods':
      return require('../assets/canned_goods.png');
    case 'salads':
      return require('../assets/salads.png');
    case 'meat_and_fish':
      return require('../assets/meat_and_fish.png');
    case 'general_products':
      return require('../assets/general_products.png');
    case 'drinks':
      return require('../assets/drinks.png');
    case 'cleaning_products_and_disposables':
      return require('../assets/cleaning_products_and_disposables.png');
    case 'personal_care_and_hygiene':
      return require('../assets/personal_care_and_hygiene.png');
    case 'nuts':
      return require('../assets/nuts.png');
    default:
      return require('../assets/general_products.png');
  }
};
