import { ga4Lessons } from './ga4Lessons';
import { gtmLessons } from './gtmLessons';
import { metaLessons } from './metaLessons';
import { Lesson } from '../types';

export const TRACKS = {
  GA4: '트랙 A: GA4 (gtag.js)',
  GTM: '트랙 B: 구글 태그 관리자 (GTM)',
  META: '트랙 C: 메타 픽셀 (Meta Pixel)',
};

export const ALL_LESSONS: Lesson[] = [
  ...ga4Lessons,
  ...gtmLessons,
  ...metaLessons
];
