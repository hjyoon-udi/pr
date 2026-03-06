const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const XML_PATH = path.resolve(__dirname, '../../corp.xml');
const OUTPUT_PATH = path.resolve(__dirname, '../public/corp_list.json');

if (!fs.existsSync(XML_PATH)) {
  const altPath = path.resolve(process.env.CORP_XML_PATH || '/Users/underedogs/Downloads/corp.xml');
  if (fs.existsSync(altPath)) {
    convertXml(altPath);
  } else {
    console.error('corp.xml 파일을 찾을 수 없습니다.');
    console.error('시도한 경로:', XML_PATH, altPath);
    process.exit(1);
  }
} else {
  convertXml(XML_PATH);
}

function convertXml(xmlPath) {
  console.log('corp.xml 읽는 중:', xmlPath);
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');

  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error('XML 파싱 오류:', err);
      process.exit(1);
    }

    const items = result.result.list;
    const corpList = items.map((item) => ({
      corp_code: (item.corp_code || '').trim(),
      corp_name: (item.corp_name || '').trim(),
      corp_eng_name: (item.corp_eng_name || '').trim(),
      stock_code: (item.stock_code || '').trim(),
      modify_date: (item.modify_date || '').trim(),
    }));

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(corpList, null, 0), 'utf-8');
    console.log(`완료! ${corpList.length}개 기업 → ${OUTPUT_PATH}`);
  });
}
