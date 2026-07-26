import { TaskRow } from "./TaskRow";

interface TaskListProps {
  tasks: Array<any>;
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-background">
        <h3 className="text-sm font-semibold text-text-primary">My Tasks</h3>
      </div>
      <div className="flex flex-col">
        {tasks.map(task => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
