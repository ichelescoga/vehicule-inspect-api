const path = require('path')

const HEADER_IMG = path.join(__dirname, '..', 'assets', 'HeaderKorea.png')
const FOOTER_IMG = path.join(__dirname, '..', 'assets', 'FooterKorea.png')
const FONT_REGULAR = path.join(__dirname, '..', 'assets', 'fonts', 'Montserrat-Regular.ttf')
const FONT_BOLD = path.join(__dirname, '..', 'assets', 'fonts', 'Montserrat-Bold.ttf')
const FONT_ITALIC = path.join(__dirname, '..', 'assets', 'fonts', 'Montserrat-Italic.ttf')

const PAGE_W = 612
const PAGE_H = 792
const MARGIN = 36

const HEADER_H = (PAGE_W / 2562) * 433
const FOOTER_H = (PAGE_W / 2575) * 637

const CONTENT_TOP = HEADER_H + 10
const CONTENT_BOTTOM = PAGE_H - FOOTER_H - 10
const CONTENT_W = PAGE_W - MARGIN * 2

const SECTION_COLORS = {
    comments: '#C62828',
    terms: '#1F497D',
    signature: '#283346',
    qa: '#607D8B',
}

function addHeaderFooter(doc) {
    doc.image(HEADER_IMG, 0, 0, { width: PAGE_W })
    doc.image(FOOTER_IMG, 0, PAGE_H - FOOTER_H, { width: PAGE_W })
}

function checkNewPage(doc, y, needed = 80) {
    if (y > CONTENT_BOTTOM - needed) {
        doc.addPage()
        addHeaderFooter(doc)
        return CONTENT_TOP
    }
    return y
}

function drawCheck(doc, x, y, label, checked) {
    doc.rect(x, y, 10, 10).stroke()
    if (checked) {
        doc.font(FONT_BOLD).fontSize(8)
        doc.text('X', x + 2, y + 1, { width: 10 })
    }
    doc.font(FONT_REGULAR).fontSize(11)
    doc.text(label, x + 14, y - 1, { width: 200 })
}

function drawSectionHeader(doc, x, y, title, icon, color) {
    const h = 24
    doc.rect(x, y, CONTENT_W, h).fill(color)
    doc.font(FONT_BOLD).fontSize(11).fillColor('#FFFFFF')
    doc.text(`${icon}  ${title}`, x + 10, y + 6, { width: CONTENT_W - 20 })
    doc.fillColor('#000000')
    return y + h + 8
}

function drawFieldBox(doc, x, y, label, value, boxH = 30) {
    if (label) {
        doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
        doc.text(label, x, y)
        y += 12
        doc.fillColor('#000000')
    }
    doc.rect(x, y, CONTENT_W, boxH).lineWidth(0.5).stroke('#CCCCCC')
    doc.font(FONT_REGULAR).fontSize(10)
    doc.text(value || '', x + 6, y + 6, { width: CONTENT_W - 12 })
    return y + boxH + 6
}

function drawChip(doc, x, y, label, active, activeColor = '#C62828') {
    const w = doc.widthOfString(label) + 16
    const h = 16
    if (active) {
        doc.rect(x, y, w, h).fill(activeColor)
        doc.font(FONT_BOLD).fontSize(8).fillColor('#FFFFFF')
        doc.text(label, x + 8, y + 4, { width: w })
    } else {
        doc.rect(x, y, w, h).lineWidth(0.5).stroke('#CCCCCC')
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text(label, x + 8, y + 4, { width: w })
    }
    doc.fillColor('#000000')
    return x + w + 6
}

function drawYesNo(doc, x, y, label, value) {
    doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
    doc.text(label, x, y)
    doc.fillColor('#000000')
    y += 14
    let cx = x
    cx = drawChip(doc, cx, y, 'SÍ', value == 1, '#2E7D32')
    cx = drawChip(doc, cx, y, 'NO', value != 1, '#C62828')
    return y + 22
}

function drawChecklistSection(doc, x, y, title, items) {
    const colDesc = 220
    const colBien = 80
    const colNo = 80
    const colNa = 80
    const rowH = 16
    const tableW = colDesc + colBien + colNo + colNa

    doc.font(FONT_BOLD).fontSize(11).fillColor('#283346')
    doc.text(title, x, y)
    y += 16
    doc.fillColor('#000000')

    doc.rect(x, y, tableW, rowH).fill('#283346')
    doc.font(FONT_BOLD).fontSize(9).fillColor('#FFFFFF')
    doc.text('DESCRIPCIÓN', x + 6, y + 3, { width: colDesc })
    doc.text('BIEN', x + colDesc, y + 3, { width: colBien, align: 'center' })
    doc.text('NO', x + colDesc + colBien, y + 3, { width: colNo, align: 'center' })
    doc.text('N/A', x + colDesc + colBien + colNo, y + 3, { width: colNa, align: 'center' })
    y += rowH
    doc.fillColor('#000000')

    for (let i = 0; i < items.length; i++) {
        const [label, value] = items[i]
        const bg = i % 2 === 0 ? '#F6F7F7' : '#FFFFFF'
        doc.rect(x, y, tableW, rowH).fill(bg)
        doc.rect(x, y, tableW, rowH).stroke('#DDDDDD')

        doc.font(FONT_REGULAR).fontSize(9).fillColor('#000000')
        doc.text(label, x + 6, y + 3, { width: colDesc - 10 })

        const checkY = y + 3
        if (value === 'BIEN') {
            doc.font(FONT_BOLD).fontSize(10).fillColor('#2E7D32')
            doc.text('\u2713', x + colDesc, checkY, { width: colBien, align: 'center' })
        } else if (value === 'NO') {
            doc.font(FONT_BOLD).fontSize(10).fillColor('#C62828')
            doc.text('\u2717', x + colDesc + colBien, checkY, { width: colNo, align: 'center' })
        } else if (value === 'NA') {
            doc.font(FONT_REGULAR).fontSize(9).fillColor('#999999')
            doc.text('N/A', x + colDesc + colBien + colNo, checkY, { width: colNa, align: 'center' })
        }
        doc.fillColor('#000000')
        y += rowH
    }

    return y
}

module.exports = {
    HEADER_IMG, FOOTER_IMG, FONT_REGULAR, FONT_BOLD, FONT_ITALIC,
    PAGE_W, PAGE_H, MARGIN, HEADER_H, FOOTER_H,
    CONTENT_TOP, CONTENT_BOTTOM, CONTENT_W,
    SECTION_COLORS,
    addHeaderFooter, checkNewPage,
    drawCheck, drawSectionHeader, drawFieldBox, drawChip, drawYesNo, drawChecklistSection,
}
