import { Lesson } from '../types';
import { ga4Phase1 } from './ga4/phase1_basics';
import { ga4Phase2 } from './ga4/phase2_events';
import { ga4Phase3 } from './ga4/phase3_conversions';
import { ga4Phase4 } from './ga4/phase4_ecommerce';
import { ga4Phase5 } from './ga4/phase5_advanced';

// Import old introduction if you want to keep it, or replace completely.
// For the 30-step curriculum request, we will rebuild the array sequence.

export const ga4Lessons: Lesson[] = [
  ...ga4Phase1,
  ...ga4Phase2,
  ...ga4Phase3,
  ...ga4Phase4,
  ...ga4Phase5
];