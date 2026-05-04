import { useList, useParsed } from "@refinedev/core";
import React from "react";
import { ICriteriaScale } from "../criteria-scales/interfaces";
import { Button, Link, ListBox } from "@heroui/react";
import EmptyState from "@/components/empty-state";
import { FolderIcon } from "@heroicons/react/24/outline";

export default function CriteriaScale() {
  const { id } = useParsed();

  const {
    result,
    query: { isLoading },
  } = useList<ICriteriaScale>({
    resource: `criteria-scales/by-criteria/${id as string}`,
    queryOptions: {
      retry: false,
    },
  });

  const scales = result?.data ?? [];

  if (isLoading) return <div>Loading...</div>;

  if (scales.length === 0)
    return (
      <EmptyState size="md">
        <EmptyState.Header>
          <EmptyState.Media variant="icon">
            <FolderIcon />
          </EmptyState.Media>
          <EmptyState.Title>Skala kriteria tidak tersedia</EmptyState.Title>
          <EmptyState.Description>
            Skala kriteria belum tersedia. Silakan tambahkan skala untuk
            kriteria ini.
          </EmptyState.Description>
        </EmptyState.Header>
        <EmptyState.Content>
          <Link className='no-underline' href={`/skala-kriteria/create?criteriaId=${id}`}>
            <Button>Tambah Skala Kriteria</Button>
          </Link>
        </EmptyState.Content>
      </EmptyState>
    );

  return (
    <ListBox aria-label="Criteria Scales" className="w-full">
      {scales.map((scale) => (
        <ListBox.Item
          key={scale.id}
          textValue={scale.category}
          className="py-3 px-4"
        >
          <div className="flex items-start justify-between gap-4 w-full">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">{scale.category}</span>
              <span className="text-xs text-default-500">
                {scale.description}
              </span>
            </div>
            <span className="shrink-0 text-xs font-mono bg-default-100 px-2 py-1 rounded">
              Scale: {scale.scaleValue}
            </span>
          </div>
        </ListBox.Item>
      ))}
    </ListBox>
  );
}
