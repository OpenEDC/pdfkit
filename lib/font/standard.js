import AFMFont from './afm';
import PDFFont from '../font';
import fs from 'fs';

// This insanity is so bundlers can inline the font files
const STANDARD_FONTS = {
  Helvetica() {
    return fs.readFileSync(__dirname + '/data/Helvetica.afm', 'utf8');
  },
  'Helvetica-Bold'() {
    return fs.readFileSync(__dirname + '/data/Helvetica-Bold.afm', 'utf8');
  }
};

class StandardFont extends PDFFont {
  constructor(document, name, id) {
    super();
    this.document = document;
    this.name = name;
    this.id = id;
    this.font = new AFMFont(STANDARD_FONTS[this.name]());
    ({
      ascender: this.ascender,
      descender: this.descender,
      bbox: this.bbox,
      lineGap: this.lineGap,
      xHeight: this.xHeight,
      capHeight: this.capHeight,
    } = this.font);
  }

  embed() {
    this.dictionary.data = {
      Type: 'Font',
      BaseFont: this.name,
      Subtype: 'Type1',
      Encoding: 'WinAnsiEncoding',
    };

    return this.dictionary.end();
  }

  encode(text) {
    const encoded = this.font.encodeText(text);
    const glyphs = this.font.glyphsForString(`${text}`);
    const advances = this.font.advancesForGlyphs(glyphs);
    const positions = [];
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i];
      positions.push({
        xAdvance: advances[i],
        yAdvance: 0,
        xOffset: 0,
        yOffset: 0,
        advanceWidth: this.font.widthOfGlyph(glyph),
      });
    }

    return [encoded, positions];
  }

  widthOfString(string, size) {
    const glyphs = this.font.glyphsForString(`${string}`);
    const advances = this.font.advancesForGlyphs(glyphs);

    let width = 0;
    for (let advance of advances) {
      width += advance;
    }

    const scale = size / 1000;
    return width * scale;
  }

  static isStandardFont(name) {
    return name in STANDARD_FONTS;
  }
}

export default StandardFont;
