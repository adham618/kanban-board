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

  return (
    <div className="m-auto py-10 flex flex-col items-center justify-center overflow-auto w-full  min-h-screen px-10">
      <Button onClick={createColumn} className="w-56 py-5">
        <PlusCircleIcon />
        Add Column
      </Button>
      <div className="mt-10 flex gap-4">
        {columns.map((column) => (
          <ColumnContainer key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}
