// generate-cert.js
import fs from 'fs'
import path from 'path'
import selfsigned from 'selfsigned'

const attrs = [{ name: 'commonName', value: 'localhost' }]
const pems = selfsigned.generate(attrs, { days: 365 })

const certDir = path.resolve('./cert')
const keyPath = path.join(certDir, 'key.pem')
const certPath = path.join(certDir, 'cert.pem')

if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir)
}

fs.writeFileSync(certPath, pems.cert, { encoding: 'utf8' })
fs.writeFileSync(keyPath, pems.private, { encoding: 'utf8' })

console.log('✅ SSL 인증서 생성 완료!')
console.log(`📁 ${certPath}`)
console.log(`📁 ${keyPath}`)
