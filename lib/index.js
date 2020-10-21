const xmldom = require('xmldom')

const filterInvalidNodes = (items) => Array.from(items).filter(item => item.childNodes)

const parseArray = (array) => filterInvalidNodes(array.childNodes).map((n) => parseFontXml(n))

const parseDict = (dict) => {
    const result = {}
    const nodes = filterInvalidNodes(dict.childNodes)
    
    for (let i = 0; i < nodes.length; i = i + 2) {
        const keyItem = nodes[i]
        const item = nodes[i + 1]
        const tag = keyItem.nodeName

        if (tag !== 'key') {
            throw new Error(`Needs a "key" tag but got: ${tag}`)
        }

        const value = parseFontXml(item)
        const key = keyItem.childNodes[0].nodeValue
        result[key] = value
    }

    return result
}

const parseFontXml = (value) => {
    switch (value.nodeName) {
        case 'key': {
            return value.childNodes[0].nodeValue
        }
        case 'dict': {
            return parseDict(value)
        }
        case 'array': {
            return parseArray(value)
        }
        case 'real': {
            return parseFloat(value.childNodes[0].nodeValue)
        }
        case 'integer': {
            return parseInt(value.childNodes[0].nodeValue)
        }
        case 'string': {
            return value.childNodes[0].nodeValue
        }
        case 'date': {
            return new Date(Date.parse(value.childNodes[0].nodeValue))
        }
        default: {
            throw new Error(`Invalid tag: ${tag}`)
        }
    }
}

const parse = (xmlData) => {
    const parser = new xmldom.DOMParser()
    const document = parser.parseFromString(xmlData, 'text/xml')
    const result = parseFontXml(document.documentElement.childNodes[1])
    const fontData = result[0]['_items']
    return fontData
}

module.exports = parse