export class GoogleVisionResponses {
  responses: GoogleVisionAnnotation[];
}
export class GoogleVisionAnnotation {
  safeSearchAnnotation: GoogleSafeSearchAnnotation;
}
export class GoogleSafeSearchAnnotation {
  adult: GoogleLikelihood;
  spoof: GoogleLikelihood;
  medical: GoogleLikelihood;
  violence: GoogleLikelihood;
  racy: GoogleLikelihood;
}
export enum GoogleLikelihood {
  UNKNOWN = 'UNKNOWN',
  VERY_UNLIKELY = 'VERY_UNLIKELY',
  UNLIKELY = 'UNLIKELY',
  POSSIBLE = 'POSSIBLE',
  LIKELY = 'LIKELY',
  VERY_LIKELY = 'VERY_LIKELY',
}
