"use client";

import { Column } from "@/types";

export default function ColumnContainer({ column }: { column: Column }) {
  return (
    <div className="flex w-[300px] h-[400px] flex-col rounded-md bg-primary p-4 shadow flex-shrink-0">
      <h2 className="text-lg font-semibold">{column.title}</h2>
    </div>
  );
}
