import fs from 'fs';

// Custom embeddable fonts used for PDF/A-3 rendering
const CustomFont = {
  "Inter-Regular": fs.readFileSync(__dirname + '/data/Inter-Regular.ttf'),
  "Inter-Bold": fs.readFileSync(__dirname + '/data/Inter-Bold.ttf')
};

export default CustomFont;
