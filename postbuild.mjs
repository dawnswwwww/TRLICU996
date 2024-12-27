import fs from 'fs'
import path from 'path'
import astroConfig from './astro.config.mjs'


const PUBLIC_DIR = astroConfig.dist || "dist"
const argvs = process.argv.slice(2);
const SITE = astroConfig.site;
const BASE = astroConfig.base;

console.log('SITE', SITE)
console.log('BASE', BASE)

const _p = new URL(SITE);
_p.pathname = BASE

const PRODUCTION_URL = _p.toString();


console.log('PRODUCTION_URL', PRODUCTION_URL)



if (SITE && BASE) {
    let files = [];
    const extensions = ['.html', '.css', '.js', '.json']


    const replaceUrlsInFiles = function(dirPath, arrayOfFiles) {
        files = fs.readdirSync(dirPath)

        files.forEach(function(file) {
            const current = fs.statSync(dirPath + "/" + file)
            if (current.isDirectory()) {
                replaceUrlsInFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                const filePath = path.join(
                    path.dirname(
                        (
                            import.meta.url).replace(/file\:/, '')), dirPath, "/", file)
                if (extensions.includes(path.extname(filePath))) {
                    let content = fs.readFileSync(filePath)

                    content = String(content).replace(/src="\//g, `src="${PRODUCTION_URL}`)
                    content = String(content).replace(/href="\//g, `href="${PRODUCTION_URL}`)
                    content = String(content).replace(/url\("\//g, `url("${PRODUCTION_URL}`)

                    content = String(content).replace(/src='\//g, `src='${PRODUCTION_URL}`)
                    content = String(content).replace(/href='\//g, `href='${PRODUCTION_URL}`)
                    content = String(content).replace(/url\('\//g, `url('${PRODUCTION_URL}`)
                    fs.writeFileSync(filePath, content)
                }
            }
        })
    }

    if (PRODUCTION_URL) {
        replaceUrlsInFiles(PUBLIC_DIR, files)
    } else {
        console.log('skip postbuild')
        process.exit(0)
    }
} else {
    console.error('please provide a path argument "-path", "--p"')
    process.exit(1)
}