// Generates app icons using only built-in Node.js modules — no npm needed
const zlib = require('zlib');
const fs   = require('fs');

function crc32(buf) {
    const t = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c;
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
    const tb  = Buffer.from(type, 'ascii');
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([tb, data])), 0);
    return Buffer.concat([len, tb, data, crc]);
}

function makePNG(size) {
    const rows = [];
    for (let y = 0; y < size; y++) {
        const row = [0]; // filter: None
        for (let x = 0; x < size; x++) {
            const t = (x + y) / (size * 2 - 2);
            // purple #a78bfa → pink #f9a8d4
            row.push(
                Math.round(167 + (249 - 167) * t),  // R
                Math.round(139 + (168 - 139) * t),  // G
                Math.round(250 + (212 - 250) * t)   // B
            );
        }
        rows.push(...row);
    }

    const sig  = Buffer.from([137,80,78,71,13,10,26,10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4);
    ihdr[8]=8; ihdr[9]=2; // 8-bit RGB

    return Buffer.concat([
        sig,
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(Buffer.from(rows))),
        chunk('IEND', Buffer.alloc(0))
    ]);
}

const dir = 'C:/Users/saleh/Downloads/emotions/';
fs.writeFileSync(dir + 'icon-192.png',       makePNG(192));
fs.writeFileSync(dir + 'icon-512.png',       makePNG(512));
fs.writeFileSync(dir + 'apple-touch-icon.png', makePNG(180));
console.log('✅ icons created!');
