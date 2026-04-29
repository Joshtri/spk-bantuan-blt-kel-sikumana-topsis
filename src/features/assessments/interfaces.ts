export interface IAssessmentDetail {
  id: string;
  criteriaScaleId: string;
  scaleValue: number;
  category: string;
  criteriaName: string;
}

export interface IAssessmentResult {
  distancePositive: number;
  distanceNegative: number;
  preferenceValue: number;
  rank: number;
  isEligible: boolean;
}

export interface IAssessment {
  id: string;
  periodId: string;
  periodName: string;
  candidateId: string;
  candidateName: string;
  assessedByUserId: string;
  assessedByUsername: string;
  details: IAssessmentDetail[];
  result?: IAssessmentResult;
}
