import { Table } from "@heroui/react";
import type { IAssessmentDetail } from "@/features/assessments/interfaces";

interface AssessmentDetailTableProps {
  details: IAssessmentDetail[];
}

export function AssessmentDetailTable({ details }: AssessmentDetailTableProps) {
  if (details.length === 0) return null;

  return (
    <Table aria-label="Detail penilaian">
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Column isRowHeader>Kriteria</Table.Column>
            <Table.Column>Kategori</Table.Column>
            <Table.Column className="text-end">Nilai</Table.Column>
          </Table.Header>
          <Table.Body>
            {details.map((detail) => (
              <Table.Row key={detail.id}>
                <Table.Cell>{detail.criteriaName}</Table.Cell>
                <Table.Cell>{detail.category}</Table.Cell>
                <Table.Cell className="text-end font-mono">
                  {detail.scaleValue}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
