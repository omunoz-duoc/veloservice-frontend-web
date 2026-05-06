'use client';

import { useState } from 'react';
import { Kanban, dropHandler } from 'react-kanban-kit'
import type { BoardData } from 'react-kanban-kit'

export const OrdenesKanban = () => {
  const [dataSource, setDataSource] = useState<BoardData>({
    root: {
      id: "root",
      title: "Root",
      children: ["col-1", "col-2", "col-3", "col-4"],
      totalChildrenCount: 3,
      parentId: null,
    },
    "col-1": {
      id: "col-1",
      title: "To Do",
      children: ["task-1", "task-2"],
      totalChildrenCount: 2,
      parentId: "root",
    },
    "col-2": {
      id: "col-2",
      title: "In Progress",
      children: ["task-3"],
      totalChildrenCount: 1,
      parentId: "root",
    },
    "col-3": {
      id: "col-3",
      title: "Done",
      children: ["task-4"],
      totalChildrenCount: 1,
      parentId: "root",
    },
    "col-4": {
      id: "col-4",
      title: "Archived",
      children: ["task-5"],
      totalChildrenCount: 1,
      parentId: "root",
    },
    "task-1": {
      id: "task-1",
      title: "Design Homepage",
      parentId: "col-1",
      children: [],
      totalChildrenCount: 0,
      type: "card",
      content: {
        description: "Create wireframes and mockups for the homepage",
        priority: "high",
      },
    },
    "task-2": {
      id: "task-2",
      title: "Setup Database",
      parentId: "col-1",
      children: [],
      totalChildrenCount: 0,
      type: "card",
    },
    "task-3": {
      id: "task-3",
      title: "Build Auth Flow",
      parentId: "col-2",
      children: [],
      totalChildrenCount: 0,
      type: "card",
    },
    "task-4": {
      id: "task-4",
      title: "Deploy to Production",
      parentId: "col-3",
      children: [],
      totalChildrenCount: 0,
      type: "card",
    },
    "task-5": {
      id: "task-5",
      title: "Old Task",
      parentId: "col-4",
      children: [],
      totalChildrenCount: 0,
      type: "card",
    },
  });

const configMap = {
  card: {
    render: ({ data, column, index, isDraggable }) => (
      <div className="task-card">
        <h4>{data.title}</h4>
        <p>{data.content?.description}</p>
        <div className="card-footer">
          <span className="assignee">{data.content?.assignee}</span>
          <span className="due-date">{data.content?.dueDate}</span>
        </div>
      </div>
    ),
    isDraggable: true,
  },

  divider: {
    render: ({ data }) => (
      <div className="divider">
        <hr />
        <span>{data.title}</span>
      </div>
    ),
    isDraggable: false,
  },

  footer: {
    render: ({ data, column }) => (
      <button className="add-card-btn">+ Add card to {column.title}</button>
    ),
    isDraggable: false,
  },
};
  return (
    <Kanban
      dataSource={dataSource}
      configMap={configMap}
      onCardMove={(move) => {
        setDataSource(dropHandler(move, dataSource, () => {}));
      }}
    />
  );
};