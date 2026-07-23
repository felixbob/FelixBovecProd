const fs = require('fs');

function replaceFile(path, search, replace) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(path, content);
}

replaceFile('src/components/Hero.tsx', /import imgBvout from '..\/assets\/images\/bvout_1783940858991.jpg';/, `import imgBvout from '../images/BVout.png';`);
replaceFile('src/components/Hero.tsx', /import logoImg from '..\/assets\/images\/felixFIN.png';/, `const logoImg = '/felixFIN.png';`);
replaceFile('src/components/Footer.tsx', /import logoImg from '..\/assets\/images\/felixFIN.png';/, `const logoImg = '/felixFIN.png';`);
replaceFile('src/components/FullCenik.tsx', /import logoImg from '..\/assets\/images\/felixFIN.png';/, `const logoImg = '/felixFIN.png';`);
replaceFile('src/components/Navbar.tsx', /import logoImg from '..\/assets\/images\/felixFIN.png';/, `const logoImg = '/felixFIN.png';`);
