"use client";

import { Column } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash } from "lucide-react";
import * as React from "react";

export default function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
}: {
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;
}) {
  const [editMode, setEditMode] = React.useState(false);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex w-[300px] border-2 opacity-40 border-rose-400 overflow-hidden h-[400px] flex-col rounded-md bg-primary shadow flex-shrink-0"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setEditMode(true)}
      className="flex w-[300px] overflow-hidden h-[400px] flex-col rounded-md bg-primary shadow flex-shrink-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-base p-3 border-4 border-columnBackground cursor-grab bg-mainBackground justify-between flex items-center gap-2 font-semibold"
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full px-2 py-1  text-sm bg-columnBackground">
            0
          </div>
          {!editMode && (
            <h2 className="text-sm font-semibold">{column.title}</h2>
          )}
          {editMode && (
            <input
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              type="text"
              className="text-sm font-semibold bg-black border rounded outline-none px-2 py-1 focus:border-rose-500"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
            />
          )}
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
