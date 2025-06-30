import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 단색 버스 아이콘 SVG 생성 (정방향)
const forwardBusSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <g fill="#3498db" stroke="none">
    <rect x="2" y="4" width="20" height="12" rx="2" ry="2" />
    <rect x="2" y="16" width="20" height="2" rx="1" ry="1" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <rect x="4" y="8" width="4" height="4" rx="1" ry="1" fill="white" />
    <rect x="10" y="8" width="4" height="4" rx="1" ry="1" fill="white" />
    <rect x="16" y="8" width="4" height="4" rx="1" ry="1" fill="white" />
  </g>
</svg>
`;

// 단색 버스 아이콘 SVG 생성 (역방향)
const reverseBusSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <g fill="#e74c3c" stroke="none">
    <rect x="2" y="4" width="20" height="12" rx="2" ry="2" />
    <rect x="2" y="16" width="20" height="2" rx="1" ry="1" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <rect x="4" y="8" width="4" height="4" rx="1" ry="1" fill="white" />
    <rect x="10" y="8" width="4" height="4" rx="1" ry="1" fill="white" />
    <rect x="16" y="8" width="4" height="4" rx="1" ry="1" fill="white" />
  </g>
</svg>
`;

// SVG 파일 저장
fs.writeFileSync(path.join(__dirname, 'public', 'images', 'bus-forward-solid.svg'), forwardBusSVG);
fs.writeFileSync(path.join(__dirname, 'public', 'images', 'bus-reverse-solid.svg'), reverseBusSVG);

console.log('단색 버스 아이콘 SVG 파일이 생성되었습니다.');
console.log('이제 src/modules/busSearch/views/BusSearchPage.vue 파일에서');
console.log('bus-forward.png를 bus-forward-solid.svg로,');
console.log('bus-reverse.png를 bus-reverse-solid.svg로 변경하세요.'); 