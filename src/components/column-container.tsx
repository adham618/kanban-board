"use client";

import { Column } from "@/types";
import { Trash } from "lucide-react";

export default function ColumnContainer({
  column,
  deleteColumn,
}: {
  column: Column;
  deleteColumn: (id: string | number) => void;
}) {
  return (
    <div className="flex w-[300px] overflow-hidden h-[400px] flex-col rounded-md bg-primary shadow flex-shrink-0">
      <div className="text-base p-3 border-4 border-columnBackground cursor-grab bg-mainBackground justify-between flex items-center gap-2 font-semibold">
        <div className="flex items-center gap-2">
          <div className="rounded-full px-2 py-1  text-sm bg-columnBackground">
            0
          </div>
          {column.title}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="rounded-full p-2 text-gray-400 hover:text-white hover:bg-columnBackground"
        >
          <Trash className="size-4 " />
        </button>
      </div>
      <div className="flex p-3 flex-grow">contwnt</div>
      <div className="p-3 ">footer</div>
    </div>
  );
}
