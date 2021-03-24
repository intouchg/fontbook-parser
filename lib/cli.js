#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const parse = require('./index')

const xmlFilepathArg = process.argv[2]
const jsonFilepathArg = process.argv[3]

if (!xmlFilepathArg) {
    console.error('No XML filepath argument was provided.')
    process.exit(1)
}

if (path.extname(xmlFilepathArg) !== '.xml') {
    console.error('First filepath argument did not end in .xml file extension.')
    process.exit(1)
}

if (!jsonFilepathArg) {
    console.error('No JSON filepath argument was provided.')
    process.exit(1)
}

if (path.extname(jsonFilepathArg) !== '.json') {
    console.error('Second filepath argument did not end in .json file extension.')
    process.exit(1)
}

const escapedXmlFilepath = `"${xmlFilepathArg.replace(/"/g, '\\"')}"`

const systemProfilerProcess = spawn(
    'system_profiler',
    [ '-xml', 'SPFontsDataType', '>', escapedXmlFilepath ],
    { shell: true, cwd: process.cwd() },
)

systemProfilerProcess.stdout.on('data', (data) => console.log(data.toString()))
systemProfilerProcess.stderr.on('data', (data) => console.log(data.toString()))

systemProfilerProcess.on('close', (code) => {
    const xmlData = fs.readFileSync(xmlFilepathArg).toString()
    fs.unlinkSync(xmlFilepathArg)
    const fontData = parse(xmlData)
    fs.writeFileSync(jsonFilepathArg, JSON.stringify(fontData))
})
