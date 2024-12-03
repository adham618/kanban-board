"use client";

import ColumnContainer from "@/components/column-container";
import { Button } from "@/components/ui/button";
import { Column } from "@/types";
import { PlusCircleIcon } from "lucide-react";
import * as React from "react";

export default function KanbanBoard() {
  const [columns, setColumns] = React.useState<Column[]>([]);

  const createColumn = () => {
    setColumns((prevColumns) => [
      ...prevColumns,
      { id: Date.now(), title: "New Column " + (prevColumns.length + 1) },
    ]);
  };

  const deleteColumn = (id: string | number) => {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.id !== id)
    );
  };

  return (
    <div className="w-full py-10 min-h-screen">
      <div className="px-6 flex items-center justify-center">
        <Button onClick={createColumn} className="w-56 py-5">
          <PlusCircleIcon />
          Add Column
        </Button>
      </div>

      <div className="mt-10 p-6 flex  overflow-x-auto w-full">
        <div className="flex gap-6 items-center mx-auto justify-center">
          {columns.map((column) => (
            <ColumnContainer
              key={column.id}
              column={column}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
