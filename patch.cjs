const fs = require('fs');
let content = fs.readFileSync('src/components/Gallery.tsx', 'utf8');
content = content.replace(/\/\/ Import images directly so Vite processes them properly([\s\S]*?)\];/m, `// Import images directly so Vite processes them properly
import imgBurgerSpecial from '../images/burger_special_1783940592831.jpg';
import imgCrispyChickenSalad from '../images/crispy_chicken_salad_1783940611493.jpg';
import imgTwoCrispyPlates from '../images/two_crispy_plates_1783940626341.jpg';
import imgBurger1 from '../images/burger-1.jpg';
import imgBurger2 from '../images/burger-2.jpg';
import imgCout from '../images/Cout.jpg';
import imgFood1 from '../images/food-1.jpg';

const images = [
  imgBurgerSpecial,
  imgCrispyChickenSalad,
  imgTwoCrispyPlates,
  imgBurger1,
  imgBurger2,
  imgCout,
  imgFood1
];`);
fs.writeFileSync('src/components/Gallery.tsx', content);
