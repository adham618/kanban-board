"use client";

import { Column } from "@/types";

export default function ColumnContainer({ column }: { column: Column }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">{column.title}</h2>
    </div>
  );
}
