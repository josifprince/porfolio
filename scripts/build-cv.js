// Generate the downloadable CV with Node.js; no external packages required.
const fs = require('node:fs');
const path = require('node:path');

const pages = [
  [
    ['title', 'Awe Joseph Mofifoluwa'],
    ['subtitle', 'Startup Technology Generalist | Full-Stack Developer | Product Builder'],
    ['text', 'Lagos, Nigeria | +234 810 824 3473'],
    ['link', 'awejosephmofifoluwa@gmail.com', 'mailto:awejosephmofifoluwa@gmail.com'],
    ['link', 'github.com/josifprince', 'https://github.com/josifprince'],
    ['link', 'linkedin.com/in/awe-joseph-9245b0123', 'https://linkedin.com/in/awe-joseph-9245b0123'],
    ['link', 'ajworldtech.com', 'https://ajworldtech.com'],
    ['section', 'PROFILE'],
    ['text', 'Lagos-based technology generalist with 9+ years in software and product work. I help teams move from an idea to working software, launch, and ongoing user support. My primary tools are PHP, CodeIgniter, and MySQL, with experience across product planning, APIs, integrations, deployment, documentation, and user communication.'],
    ['section', 'EXPERIENCE'],
    ['heading', 'AJWORLDTECH | Technology Generalist and Full-Stack Developer'],
    ['date', '2014 - Present'],
    ['text', 'Build and maintain web applications and backend features for education, billing, business, and communication products. Develop APIs, database structures, workflows, and integrations. Contribute across requirements, feature planning, implementation, testing, deployment, troubleshooting, and user support.'],
    ['heading', 'Ebunoluwa International School | ICT and Backend Solutions'],
    ['date', '2021 - 2023'],
    ['text', 'Designed and managed a computer-based testing backend used by more than 100 students, supporting exam processing, server performance, student data, and reporting workflows.'],
    ['heading', 'MTN Nigeria | Marketing Representative'],
    ['date', 'January 2024 - Present'],
    ['text', 'Support customer-facing marketing, product communication, and outreach. Understand customer needs and explain technology-enabled services.'],
    ['heading', 'Independent Development | Freelance Developer'],
    ['date', '2018 - Present'],
    ['text', 'Deliver backend-driven applications using PHP and C#. Build APIs that support Flutter and Kotlin mobile applications and maintain backend-focused GitHub repositories.'],
    ['section', 'TECHNICAL AND PRODUCT SKILLS'],
    ['text', 'Backend and web: PHP 8, CodeIgniter, MySQL, REST APIs, JavaScript, HTML, CSS.'],
    ['text', 'Product delivery: requirements gathering, MVP planning, feature breakdown, workflow design, testing, deployment, documentation, onboarding, and support.'],
    ['text', 'Integrations and operations: payment gateways, hosting, deployment, troubleshooting, Git, and GitHub.'],
    ['text', 'Additional working experience: C#/.NET, Kotlin, Flutter integrations, WordPress, Bootstrap, and Tailwind CSS.'],
  ],
  [
    ['title', 'Awe Joseph Mofifoluwa'],
    ['subtitle', 'Selected products, communication, and professional development'],
    ['section', 'FEATURED PRODUCTS'],
    ['heading', 'BillChamp | Billing and business-management SaaS'],
    ['link', 'billchamp.ajworldtech.com', 'https://billchamp.ajworldtech.com'],
    ['text', 'Supports invoices, receipts, proformas, payment tracking, reminders, recurring invoices, inventory and POS workflows, waybill tracking, reports, and payment integrations.'],
    ['text', 'Contribution: product planning and delivery, PHP backend and web development, database and workflow design, integrations, deployment, and ongoing improvements.'],
    ['text', 'Outcome: more than NGN 43.3 million in invoices processed; used by 8+ businesses.'],
    ['heading', 'CodeChamp | Coding and STEM learning for schools'],
    ['link', 'codechamp.ajworldtech.com', 'https://codechamp.ajworldtech.com'],
    ['text', 'Supports school, teacher, student, and parent workflows, coding lessons, enrollment, term access, and coupon-based payment features.'],
    ['text', 'Contribution: platform development, feature planning, school onboarding, payment-related features, deployment, and user support.'],
    ['text', 'Outcome: approximately 180 students across two schools in an early four-month period.'],
    ['heading', 'FreeMeet | Browser-based meetings'],
    ['link', 'freemeet.ajworldtech.com', 'https://freemeet.ajworldtech.com'],
    ['text', 'Room creation and joining, guest access, device preview, participant controls, messaging, and real-time meeting functionality.'],
    ['text', 'Contribution: web product and backend foundations, the journey from room creation through participation, and responsive meeting controls.'],
    ['section', 'DIGITAL COMMUNICATION'],
    ['text', 'Practical experience in social media management, content planning and scheduling, brand-page management, publishing, community engagement, campaign coordination, and digital marketing. Support product communication, explain features to users, and connect customer-facing feedback with product teams.'],
    ['section', 'EDUCATION AND PROFESSIONAL DEVELOPMENT'],
    ['text', 'B.Sc. Forestry and Wildlife | University of Ilorin | 2014 - 2019'],
    ['text', 'Software Engineer Certificate | ALX | 2024'],
    ['text', 'Google Android Developer (Kotlin) | 2023'],
    ['text', 'Professional Diploma in Web Development | Shaw Academy | 2020'],
    ['text', 'Professional Diploma in Digital Marketing | Shaw Academy | 2020'],
    ['text', 'Networking Academy Learn-A-Thon | Cisco | 2021'],
  ],
];

const objects = [];
const add = value => { objects.push(Buffer.isBuffer(value) ? value : Buffer.from(value, 'ascii')); return objects.length; };
const escape = value => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
const catalog = add('');
const pageTree = add('');
// Embed Arial so viewers do not substitute an unrelated system font.
function embedFont(filename, name) {
  const fontDirectory = process.env.CV_FONT_DIRECTORY || path.join(process.env.WINDIR || 'C:/Windows', 'Fonts');
  const data = fs.readFileSync(path.join(fontDirectory, filename));
  const tables = {};
  for (let index = 0; index < data.readUInt16BE(4); index++) {
    const offset = 12 + index * 16;
    tables[data.toString('ascii', offset, offset + 4)] = data.readUInt32BE(offset + 8);
  }
  const units = data.readUInt16BE(tables.head + 18);
  const scale = value => Math.round(value * 1000 / units);
  const hhea = tables.hhea;
  const metricCount = data.readUInt16BE(hhea + 34);
  const cmap = tables.cmap;
  let map;
  for (let index = 0; index < data.readUInt16BE(cmap + 2); index++) {
    const record = cmap + 4 + index * 8;
    const candidate = cmap + data.readUInt32BE(record + 4);
    if (data.readUInt16BE(candidate) === 4 && data.readUInt16BE(record) === 3) map = candidate;
  }
  if (!map) throw new Error('Font has no supported character map');
  const count = data.readUInt16BE(map + 6) / 2;
  function glyph(code) {
    for (let index = 0; index < count; index++) {
      const end = data.readUInt16BE(map + 14 + index * 2);
      const start = data.readUInt16BE(map + 16 + count * 2 + index * 2);
      if (code < start || code > end) continue;
      const delta = data.readInt16BE(map + 16 + count * 4 + index * 2);
      const location = map + 16 + count * 6 + index * 2;
      const range = data.readUInt16BE(location);
      if (!range) return (code + delta) & 65535;
      const value = data.readUInt16BE(location + range + (code - start) * 2);
      return value ? (value + delta) & 65535 : 0;
    }
    return 0;
  }
  const widths = Array.from({ length: 95 }, (_, index) => scale(data.readUInt16BE(tables.hmtx + Math.min(glyph(index + 32), metricCount - 1) * 4)));
  const compressed = require('node:zlib').deflateSync(data);
  const file = add(Buffer.concat([Buffer.from(`<< /Length ${compressed.length} /Length1 ${data.length} /Filter /FlateDecode >>\nstream\n`), compressed, Buffer.from('\nendstream')]));
  const bbox = [36, 38, 40, 42].map(offset => scale(data.readInt16BE(tables.head + offset)));
  const descriptor = add(`<< /Type /FontDescriptor /FontName /${name} /Flags 32 /FontBBox [${bbox.join(' ')}] /ItalicAngle 0 /Ascent ${scale(data.readInt16BE(hhea + 4))} /Descent ${scale(data.readInt16BE(hhea + 6))} /CapHeight 716 /StemV 80 /FontFile2 ${file} 0 R >>`);
  return add(`<< /Type /Font /Subtype /TrueType /BaseFont /${name} /FirstChar 32 /LastChar 126 /Widths [${widths.join(' ')}] /Encoding /WinAnsiEncoding /FontDescriptor ${descriptor} 0 R >>`);
}
const regular = embedFont('arial.ttf', 'Arial');
const bold = embedFont('arialbd.ttf', 'Arial-Bold');
const portraitPath = path.join(__dirname, '..', 'assets', 'cv-portrait.jpg');
if (!fs.existsSync(portraitPath)) throw new Error('Missing assets/cv-portrait.jpg');
const portrait = fs.readFileSync(portraitPath);
const imageId = add(Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width 600 /Height 600 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${portrait.length} >>\nstream\n`), portrait, Buffer.from('\nendstream')]));
const pageIds = [];
const colors = { navy: '0.08 0.17 0.23', teal: '0.09 0.38 0.37', muted: '0.31 0.38 0.43', white: '1 1 1', soft: '0.94 0.96 0.97' };

// Conservative Helvetica character widths keep text within its column.
function textWidth(value, size, weight = false) {
  return [...value].reduce((total, char) => {
    const narrow = " ilI.,:;'!|".includes(char);
    const wide = 'MW@%'.includes(char);
    return total + (narrow ? .29 : wide ? .9 : /[A-Z]/.test(char) ? .7 : .57) * size * (weight ? 1.035 : 1);
  }, 0);
}
function wrap(value, width, size, weight) {
  const lines = [];
  let line = '';
  const words = value.split(' ').flatMap(word => {
    if (textWidth(word, size, weight) <= width) return [word];
    const pieces = [];
    let piece = '';
    for (const character of word) {
      if (piece && textWidth(piece + character, size, weight) > width) { pieces.push(piece); piece = ''; }
      piece += character;
    }
    if (piece) pieces.push(piece);
    return pieces;
  });
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (line && textWidth(candidate, size, weight) > width) { lines.push(line); line = word; }
    else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
}

pages.forEach((blocks, pageIndex) => {
  const commands = [];
  const annotations = [];
  function rect(x, y, width, height, color) { commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`); }
  function text(value, x, y, size, boldText = false, color = colors.navy) {
    commands.push(`BT /${boldText ? 'F2' : 'F1'} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${escape(value)}) Tj ET`);
  }
  function column(content, x, initialY, width, sidebar = false) {
    let y = initialY;
    for (const [kind, value, url] of content) {
      const section = kind === 'section', heading = kind === 'heading';
      const size = section ? 10 : heading ? 10.5 : sidebar ? 9 : 10;
      const lineHeight = sidebar ? 13 : 14;
      if (section) {
        y -= 15;
        rect(x, y + 6, 22, 2, colors.teal);
        y -= 9;
      } else if (heading) y -= 7;
      const color = section || kind === 'link' ? colors.teal : kind === 'date' ? colors.muted : colors.navy;
      for (const line of wrap(value, width, size, section || heading)) {
        if (y < 58) throw new Error(`Page ${pageIndex + 1} ${sidebar ? 'sidebar' : 'main'} overflow: ${value}`);
        text(line, x, y, size, section || heading, color);
        if (url) annotations.push(add(`<< /Type /Annot /Subtype /Link /Rect [${x} ${y - 3} ${x + width} ${y + size}] /Border [0 0 0] /A << /S /URI /URI (${escape(url)}) >> >>`));
        y -= lineHeight;
      }
      y -= section ? 7 : kind === 'date' || kind === 'link' ? 4 : 8;
    }
    return y;
  }
  rect(0, 678, 595, 164, colors.navy);
  rect(0, 838, 595, 4, '0.90 0.63 0.42');
  text('Awe Joseph', 36, 790, 27, true, colors.white);
  text('Mofifoluwa', 36, 756, 27, true, colors.white);
  text('Startup Technology Generalist', 36, 725, 11, false, '0.77 0.88 0.89');
  text('Full-Stack Developer | Product Builder', 36, 708, 10.5, false, '0.77 0.88 0.89');
  rect(447, 699, 116, 116, colors.white);
  commands.push(`q 112 0 0 112 449 701 cm /Portrait Do Q`);
  rect(24, 54, 164, 600, colors.soft);

  if (pageIndex === 0) {
    const skillsIndex = blocks.findIndex(block => block[1] === 'TECHNICAL AND PRODUCT SKILLS');
    const profileIndex = blocks.findIndex(block => block[1] === 'PROFILE');
    const contact = [
      ['section', 'CONTACT'],
      ['text', 'Lagos, Nigeria'],
      ['link', '+234 810 824 3473', 'tel:+2348108243473'],
      ['link', 'awejosephmofifoluwa@gmail.com', 'mailto:awejosephmofifoluwa@gmail.com'],
      ['link', 'GitHub: josifprince', 'https://github.com/josifprince'],
      ['link', 'LinkedIn profile', 'https://linkedin.com/in/awe-joseph-9245b0123'],
      ['link', 'ajworldtech.com', 'https://ajworldtech.com'],
      ['section', 'CORE SKILLS'],
      ...blocks.slice(skillsIndex + 1),
    ];
    column(contact, 36, 648, 140, true);
    column(blocks.slice(profileIndex, skillsIndex), 210, 648, 349);
  } else {
    const productIndex = blocks.findIndex(block => block[1] === 'FEATURED PRODUCTS');
    const communicationIndex = blocks.findIndex(block => block[1] === 'DIGITAL COMMUNICATION');
    const educationIndex = blocks.findIndex(block => block[1] === 'EDUCATION AND PROFESSIONAL DEVELOPMENT');
    column([
      ['section', 'EDUCATION'],
      ...blocks.slice(educationIndex + 1),
      ['section', 'COMMUNICATION'],
      ...blocks.slice(communicationIndex + 1, educationIndex),
    ], 36, 648, 140, true);
    column(blocks.slice(productIndex, communicationIndex), 210, 648, 349);
  }
  commands.push('0.86 0.89 0.91 RG 0.5 w 36 42 m 559 42 l S');
  text('Awe Joseph Mofifoluwa | Curriculum Vitae', 36, 26, 8, false, colors.muted);
  text(`${pageIndex + 1} / ${pages.length}`, 535, 26, 8, false, colors.muted);
  const stream = commands.join('\n');
  const content = add(`<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}\nendstream`);
  pageIds.push(add(`<< /Type /Page /Parent ${pageTree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> /XObject << /Portrait ${imageId} 0 R >> >> /Contents ${content} 0 R /Annots [${annotations.map(id => `${id} 0 R`).join(' ')}] >>`));
});
objects[catalog - 1] = Buffer.from(`<< /Type /Catalog /Pages ${pageTree} 0 R >>`);
objects[pageTree - 1] = Buffer.from(`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>`);
const info = add('<< /Title (Awe Joseph Mofifoluwa - CV) /Author (Awe Joseph Mofifoluwa) >>');
const chunks = [Buffer.from('%PDF-1.4\n')];
let length = chunks[0].length;
const offsets = [0];
objects.forEach((object, index) => {
  offsets.push(length);
  const buffer = Buffer.concat([Buffer.from(`${index + 1} 0 obj\n`), object, Buffer.from('\nendobj\n')]);
  chunks.push(buffer); length += buffer.length;
});
let tail = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
tail += offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
tail += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${length}\n%%EOF\n`;
chunks.push(Buffer.from(tail));
const output = path.join(__dirname, '..', 'assets', 'Awe_Joseph_Mofifoluwa_CV.pdf');
fs.writeFileSync(output, Buffer.concat(chunks));
console.log(`Created ${pages.length}-page CV with portrait: ${output}`);
