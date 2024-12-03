"use client";

import TaskCard from "@/components/task-card";
import { Column, Task } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon, Trash2Icon } from "lucide-react";
import * as React from "react";

export default function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: {
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;
  createTask: (columnId: string | number) => void;
  tasks: Task[];
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
}) {
  const [editMode, setEditMode] = React.useState(false);
  const tasksId = React.useMemo(() => tasks.map((task) => task.id), [tasks]);
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
      className="flex w-[300px] overflow-hidden h-[400px] flex-col rounded-md bg-primary shadow flex-shrink-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-base p-3 border-4 border-columnBackground cursor-grab bg-mainBackground justify-between flex items-center gap-2 font-semibold"
        onClick={() => setEditMode(true)}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full px-2 py-1  text-sm bg-columnBackground">
            {column.id}
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
          <Trash2Icon className="size-4" />
        </button>
      </div>
      <div className="flex p-2 flex-col gap-2 overflow-x-hidden overflow-y-auto flex-grow">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        type="button"
        className="p-4 flex items-center gap-2 border-columnBackground border-2 rounded-md active:bg-black hover:bg-mainBackground"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}
