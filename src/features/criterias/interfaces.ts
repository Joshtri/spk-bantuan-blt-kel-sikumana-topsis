export interface ICriteria {
    id: number;
    name: string;
    code: string;
    criteriaType: "Cost" | "Benefit";
    weight: number;
}