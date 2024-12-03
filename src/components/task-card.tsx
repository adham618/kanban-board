"use client";

import { Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2Icon } from "lucide-react";
import * as React from "react";

export default function TaskCard({
  task,
  deleteTask,
  updateTask,
}: {
  task: Task;
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
}) {
  const [mouseIsOver, setMouseIsOver] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
  const {
    setNodeRef,
    transform,
    transition,
    // attributes,
    // listeners,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editMode) {
    return (
      <div className="bg-mainBackground p-2.5 h-[60px] min-h-[60px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative">
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Enter task content"
          onBlur={toggleEditMode}
          onKeyDown={(e) => e.key === "Enter" && e.shiftKey && toggleEditMode()}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  // if (isDragging) {
  //   return (
  //     <div
  //       ref={setNodeRef}
  //       style={style}
  //       className="flex w-[300px] border-2 opacity-40 border-rose-400 overflow-hidden h-[400px] flex-col rounded-md bg-primary shadow flex-shrink-0"
  //     ></div>
  //   );
  // }

  return (
    <div
      className="bg-mainBackground p-2.5 h-[60px] min-h-[60px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleEditMode}
    >
      <p className="my-auto flex items-center h-[90%] w-full overflow-auto whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          className="absolute top-1/2 -translate-y-1/2 bg-columnBackground p-2 rounded opacity-60 hover:opacity-100 right-4 text-white outline-none"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2Icon className="size-4" />
        </button>
      )}
    </div>
  );
}
