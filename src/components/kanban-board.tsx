"use client";

import ColumnContainer from "@/components/column-container";
import TaskCard from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { Column, Task } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusCircleIcon } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import useLocalStorageState from "use-local-storage-state";

export default function KanbanBoard() {
  const [columns, setColumns] = useLocalStorageState<Column[]>("columns", {
    defaultValue: [],
  });
  const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const [tasks, setTasks] = useLocalStorageState<Task[]>("tasks", {
    defaultValue: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const createColumn = () => {
    setColumns((prevColumns) => [
      ...prevColumns,
      {
        id: prevColumns.length + 1,
        title: "New Column " + (prevColumns.length + 1),
      },
    ]);
  };

  const deleteColumn = (id: string | number) => {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.id !== id)
    );
    setTasks((prevTasks) => prevTasks.filter((task) => task.columnId !== id));
  };

  const updateColumn = (id: string | number, title: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === id ? { ...column, title } : column
      )
    );
  };

  const columnsId = React.useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { over, active } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;
    if (activeColumnId !== overColumnId) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex(
          (column) => column.id === activeColumnId
        );
        const overColumnIndex = prevColumns.findIndex(
          (column) => column.id === overColumnId
        );

        return arrayMove(prevColumns, activeColumnIndex, overColumnIndex);
      });
    }
    setActiveColumn(null);
  };

  // tasks
  const createTask = (columnId: string | number) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), content: `Task ${prevTasks.length + 1}`, columnId },
    ]);
  };

  const deleteTask = (id: string | number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string | number, content: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const onDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    if (!isActiveTask) return;

    // If dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((prevTasks) => {
        const activeTaskIndex = prevTasks.findIndex(
          (task) => task.id === activeId
        );
        const overTaskIndex = prevTasks.findIndex((task) => task.id === overId);
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        return arrayMove(prevTasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";
    // If droppinf a task over a another column

    if (isActiveTask && isOverColumn) {
      setTasks((prevTasks) => {
        const activeTaskIndex = prevTasks.findIndex(
          (task) => task.id === activeId
        );
        tasks[activeTaskIndex].columnId = overId;
        return arrayMove(prevTasks, activeTaskIndex, activeTaskIndex);
      });
    }
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
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-6 items-center mx-auto justify-center">
            <SortableContext
              items={columnsId}
              strategy={verticalListSortingStrategy}
            >
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn ? (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ) : null}
              {activeTask ? (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}
