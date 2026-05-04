import { Heading } from "@/components/heading";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { ICriteriaScale } from "@/features/criteria-scales/interfaces";
import { ApiResponse } from "@/interfaces/IBaseEntity";
import { Card, Chip, Table, Separator, Spinner } from "@heroui/react";
import { useCustom } from "@refinedev/core";

export interface ICriteriaWithScales {
  id: string;
  name: string;
  weight: number;
  code: string;
  criteriaType: number;
  scales: ICriteriaScale[];
}

export interface CriteriasWithScalesVm {
  criterias: ICriteriaWithScales[];
}

export default function QuestionListPreview() {
  const {
    result,
    query: { isLoading },
  } = useCustom<ApiResponse<CriteriasWithScalesVm>>({
    url: "criterias/with-scales",
    method: "get",
  });

  const criteriaData: ICriteriaWithScales[] =
    result?.data?.data?.criterias ?? [];

  return (
    <div className="flex flex-col gap-3">
      <Heading as="h2" size="xl" weight="bold">
        Preview Kuisioner
      </Heading>
      <p className="text-sm text-default-500">
        Berikut adalah preview dari kriteria beserta skala yang telah dibuat.
      </p>
      <LoadingScreen isLoading={isLoading} />
      {criteriaData.map((criteria, index) => (
        <Card key={criteria.id}>
          <Card.Header className="px-6 pt-5 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-default-400">
                {index + 1}.
              </span>
              <Chip size="sm" variant="soft" color="accent">
                {criteria.code}
              </Chip>
              <Heading
                weight="semibold"
                as="h3"
                className="text-base text-default-800"
              >
                {criteria.name}
              </Heading>
            </div>
          </Card.Header>

          <Separator />

          <Card.Content className="px-4 py-3">
            <Table aria-label={`Skala kriteria ${criteria.name}`}>
              <Table.ScrollContainer>
                <Table.Content aria-label={`Data table for ${criteria.name}`}>
                  <Table.Header>
                    <Table.Column isRowHeader className="w-16 text-center">
                      Nilai
                    </Table.Column>
                    <Table.Column className="w-40">Kategori</Table.Column>
                    <Table.Column>Keterangan</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {criteria.scales.map((scale) => (
                      <Table.Row key={scale.id}>
                        <Table.Cell className="text-center">
                          <Chip size="sm" color="warning" variant="soft">
                            {scale.scaleValue}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell className="font-medium text-sm">
                          {scale.category}
                        </Table.Cell>
                        <Table.Cell className="text-sm text-default-600">
                          {scale.description}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}
