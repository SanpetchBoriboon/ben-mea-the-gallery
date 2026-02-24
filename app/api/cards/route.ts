import { NextRequest, NextResponse } from 'next/server';

interface ApiCard {
  _id: string;
  title: string;
  message: string;
  template: string; // Hex color code for tape
  imageUrl: string;
}

interface ApiResponse {
  message: string;
  cards: ApiCard[];
  count: number;
}

export async function GET(_request: NextRequest) {
  // Mock data for wish cards
  const mockCards: ApiCard[] = [
    {
      _id: '1',
      title: 'ขอให้มีความสุขมากๆ นะคะ',
      message:
        'ขอให้พี่สองคนมีความสุขมากๆ นะคะ รักกันตลอดไปเลย ขอให้เป็นครอบครัวที่อบอุ่น มีลูกสาวลูกชายครบครัน สุขภาพแข็งแรง มีความรักที่ยั่งยืน',
      template: '#F8F3C7',
      imageUrl:
        'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg',
    },
    {
      _id: '2',
      title: 'ยินดีด้วยนะคะ',
      message:
        'ยินดีด้วยกับการแต่งงานนะคะ ขอให้รักกันแบบนี้ตลอดไป มีความสุขในชีวิตคู่ ไม่มีใครมาแย่งได้เลยล่ะ ขอให้เป็นสุขไปตลอดชีวิต',
      template: '#F5C2C7',
      imageUrl:
        'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg',
    },
    {
      _id: '3',
      title: 'ขอบคุณที่เชิญมาในงานแต่งงาน',
      message:
        'ขอบคุณที่เชิญมาร่วมงานแต่งงานนะคะ รู้สึกดีใจมากที่ได้มาร่วมแสดงความยินดี ขอให้มีความสุขมากๆ อยู่ด้วยกันไปนานๆ มีลูกเก่งๆ คล้ายพ่อคล้ายแม่',
      template: '#E2E3E5',
      imageUrl:
        'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-03.jpg',
    },
    {
      _id: '4',
      title: 'ขอให้รักกันตลอดไป',
      message:
        'ขอให้รักกันตลอดไป ไม่ว่าจะเจออะไร ขอให้ผ่านไปได้ด้วยดี มีกำลังใจซึ่งกันและกัน ดูแลกันและกันไปตลอดชีวิต ขอให้มีความสุขมากๆ',
      template: '#B6EFFB',
      imageUrl:
        'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg',
    },
    {
      _id: '5',
      title: 'อวยพรจากเพื่อนรัก',
      message:
        'เป็นเพื่อนกันมาตั้งแต่เด็ก ดีใจมากที่เห็นเธอได้ความสุข ขอให้คู่บ่าวสาวมีความสุขมากๆ นะ รักกันแบบนี้ไปตลอดชีวิตเลย ขอให้โชคดีในทุกๆ เรื่อง',
      template: '#A3CFBB',
      imageUrl:
        'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg',
    },
    {
      _id: '6',
      title: 'ขอพรจากครอบครัว',
      message:
        'ในนามของครอบครัว ขออวยพรให้ลูกรักมีความสุขกับชีวิตคู่นะลูก ขอให้ดูแลกันและกันไปตลอดชีวิต มีลูกหลานให้พ่อแม่ได้เล่นบ้าง รักกันนานๆ นะลูก',
      template: '#E0C3FC',
      imageUrl:
        'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-03.jpg',
    },
  ];

  const response: ApiResponse = {
    message: 'Cards retrieved successfully',
    cards: mockCards,
    count: mockCards.length,
  };

  return NextResponse.json(response);
}
