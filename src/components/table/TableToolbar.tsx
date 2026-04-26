import { type BaseRecord } from '@refinedev/core';
import {
  Button,
  cn,
  Dropdown,
  InputGroup,
  ListBox,
  Select,
  TextField,
} from '@heroui/react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

import { Heading } from '@/components/heading';

import {
  ActionButton,
  type ActionButtonHandlerMap,
  type CustomActionButton,
  type CustomFilter,
} from './types';

interface TableToolbarProps<T extends BaseRecord> {
  label?: string;
  isCardMode: boolean;
  withSearch: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  actionColumns: ActionButton[];
  customActionButtons: CustomActionButton[];
  customFilters: CustomFilter<T>[];
  filterValues: Record<string, Set<string | boolean>>;
  setFilterValues: React.Dispatch<
    React.SetStateAction<Record<string, Set<string | boolean>>>
  >;
  onActionPress?: Partial<ActionButtonHandlerMap<T>>;
  computedRows: BaseRecord[];
  handleCreate: () => void;
  handleExport: () => Promise<void>;
  handleImport: () => Promise<void>;
}

export function TableToolbar<T extends BaseRecord>({
  label,
  isCardMode,
  withSearch,
  searchValue,
  setSearchValue,
  actionColumns,
  customActionButtons,
  customFilters,
  filterValues,
  setFilterValues,
  handleCreate,
  handleExport,
  handleImport,
}: TableToolbarProps<T>) {
  return (
    <div className="mb-5 flex w-full flex-col gap-y-4">
      {label && (
        <Heading className="my-auto text-xl font-semibold">{label}</Heading>
      )}

      <div
        className={cn(
          'flex w-full items-center justify-between gap-4',
          isCardMode ? 'flex-col items-start' : '',
        )}
      >
        {/* Left Side - Create & Custom Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {actionColumns.includes(ActionButton.Create) && (
            <Button
              variant="primary"
              isIconOnly={isCardMode}
              onPress={handleCreate}
            >
              {isCardMode ? (
                <PlusIcon className="h-4 w-4" />
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Create
                </>
              )}
            </Button>
          )}

          {customActionButtons.map((customButton) =>
            customButton.render ? (
              <div key={customButton.key}>{customButton.render}</div>
            ) : (
              <Button
                key={customButton.key}
                variant={customButton.variant ?? 'primary'}
                isPending={customButton.isLoading}
                isDisabled={customButton.isDisabled}
                onPress={customButton.onPress}
              >
                {customButton.icon}
                {customButton.label}
              </Button>
            ),
          )}
        </div>

        {/* Right Side - Search, Filters, Export/Import */}
        <div
          className={cn(
            'flex items-center gap-3',
            isCardMode ? 'w-full flex-col items-stretch' : '',
          )}
        >
          {withSearch && (
            <TextField
              aria-label="Search"
              value={searchValue}
              onChange={setSearchValue}
              className={cn(isCardMode ? 'w-full' : 'w-64 min-w-40')}
            >
              <InputGroup>
                <InputGroup.Prefix>
                  <MagnifyingGlassIcon className="h-4 w-4 text-default-400" />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="Search..." />
                {searchValue && (
                  <InputGroup.Suffix>
                    <Button
                      isIconOnly
                      variant="ghost"
                      onPress={() => setSearchValue('')}
                      aria-label="Clear search"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </InputGroup.Suffix>
                )}
              </InputGroup>
            </TextField>
          )}

          <div
            className={cn(
              'flex items-center gap-3',
              isCardMode ? 'justify-end' : '',
            )}
          >
            {/* Custom Filters */}
            {customFilters.map((filter) => {
              const isMultiple = filter.type === 'multiple';
              const currentValues = filterValues[filter.key];
              const hasActiveFilter =
                isMultiple &&
                currentValues &&
                currentValues.size > 0 &&
                !currentValues.has('all');

              const selectedKeys = new Set(
                Array.from(filterValues[filter.key] ?? []).map(String),
              );

              return (
                <div key={filter.key} className="flex items-center gap-1">
                  <Select
                    variant="secondary"
                    selectionMode={isMultiple ? 'multiple' : 'single'}
                    className="w-48"
                    placeholder={filter.placeholder ?? `Select ${filter.label}`}
                    value={selectedKeys}
                    onChange={(keys) => {
                      const selected = keys as Set<string>;
                      if (isMultiple) {
                        if (selected.has('all')) {
                          if (
                            selected.size > 1 &&
                            selectedKeys.has('all')
                          ) {
                            selected.delete('all');
                            setFilterValues((prev) => ({
                              ...prev,
                              [filter.key]: new Set(selected),
                            }));
                            return;
                          }
                          setFilterValues((prev) => ({
                            ...prev,
                            [filter.key]: new Set(['all']),
                          }));
                        } else {
                          setFilterValues((prev) => ({
                            ...prev,
                            [filter.key]: selected,
                          }));
                        }
                      } else {
                        setFilterValues((prev) => ({
                          ...prev,
                          [filter.key]: selected,
                        }));
                      }
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {filter.options.map((option) => (
                          <ListBox.Item
                            key={String(option.value)}
                            id={String(option.value)}
                          >
                            {option.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {isMultiple && hasActiveFilter && (
                    <button
                      onClick={() =>
                        setFilterValues((prev) => ({
                          ...prev,
                          [filter.key]: new Set(['all']),
                        }))
                      }
                      aria-label="Clear filter"
                      className="cursor-pointer rounded-full p-1 text-default-400 hover:text-default-600"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Export/Import Buttons */}
            {!isCardMode ? (
              <>
                {actionColumns.includes(ActionButton.Export) && (
                  <Button
                    variant="outline"
                    onPress={async () => {
                      await handleExport();
                    }}
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export
                  </Button>
                )}

                {actionColumns.includes(ActionButton.Import) && (
                  <Button
                    variant="outline"
                    onPress={async () => {
                      await handleImport();
                    }}
                  >
                    <ArrowUpTrayIcon className="h-4 w-4" />
                    Import
                  </Button>
                )}
              </>
            ) : (
              (actionColumns.includes(ActionButton.Export) ||
                actionColumns.includes(ActionButton.Import)) && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button isIconOnly variant="outline">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Popover>
                    <Dropdown.Menu aria-label="Export/Import">
                      {[
                        ...(actionColumns.includes(ActionButton.Export)
                          ? [
                              <Dropdown.Item
                                id="export"
                                onPress={async () => {
                                  await handleExport();
                                }}
                              >
                                <span className="flex items-center gap-2">
                                  <ArrowDownTrayIcon className="h-4 w-4" />
                                  Export
                                </span>
                              </Dropdown.Item>,
                            ]
                          : []),
                        ...(actionColumns.includes(ActionButton.Import)
                          ? [
                              <Dropdown.Item
                                id="import"
                                onPress={async () => {
                                  await handleImport();
                                }}
                              >
                                <span className="flex items-center gap-2">
                                  <ArrowUpTrayIcon className="h-4 w-4" />
                                  Import
                                </span>
                              </Dropdown.Item>,
                            ]
                          : []),
                      ]}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
