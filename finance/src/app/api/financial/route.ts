import { NextRequest, NextResponse } from 'next/server';
import { OpenDartResponse } from '@/types';

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENDART_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenDART API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const corp_code = searchParams.get('corp_code');
  const bsns_year = searchParams.get('bsns_year');
  const reprt_code = searchParams.get('reprt_code');

  if (!corp_code || !bsns_year || !reprt_code) {
    return NextResponse.json(
      { error: '필수 파라미터가 누락되었습니다: corp_code, bsns_year, reprt_code' },
      { status: 400 }
    );
  }

  const url = new URL('https://opendart.fss.or.kr/api/fnlttSinglAcnt.json');
  url.searchParams.set('crtfc_key', apiKey);
  url.searchParams.set('corp_code', corp_code);
  url.searchParams.set('bsns_year', bsns_year);
  url.searchParams.set('reprt_code', reprt_code);

  try {
    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `OpenDART 서버 오류: ${response.status}` },
        { status: response.status }
      );
    }

    const data: OpenDartResponse = await response.json();

    if (data.status !== '000') {
      return NextResponse.json(
        { error: `OpenDART 오류 (${data.status}): ${data.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('OpenDART API 호출 오류:', error);
    return NextResponse.json(
      { error: 'OpenDART API 호출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
