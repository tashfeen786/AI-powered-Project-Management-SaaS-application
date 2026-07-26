import { Task } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const priorityStyles = {
  High: "bg-danger/10 text-danger",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-primary/10 text-primary",
};

const statusStyles = {
  Todo: "text-text-secondary",
  "In Progress": "text-primary",
  Review: "text-warning",
  Done: "text-success line-through",
};

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-x-auto">
      <div className="px-5 py-4 border-b border-border bg-background">
        <h2 className="text-sm font-semibold text-text-primary">My Tasks</h2>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-xs text-text-secondary bg-surface">
            <th className="px-5 py-3 font-medium">Task</th>
            <th className="px-5 py-3 font-medium">Project</th>
            <th className="px-5 py-3 font-medium">Priority</th>
            <th className="px-5 py-3 font-medium">Due Date</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-b border-border last:border-0 hover:bg-background transition-colors duration-150 group cursor-pointer">
              <td className="px-5 py-3">
                <span className={cn("text-sm font-medium transition-colors", task.status === 'Done' ? 'text-text-secondary line-through' : 'text-text-primary group-hover:text-primary')}>{task.title}</span>
              </td>
              <td className="px-5 py-3 text-xs text-text-secondary">{task.project}</td>
              <td className="px-5 py-3">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider", priorityStyles[task.priority])}>
                  {task.priority}
                </span>
              </td>
              <td className="px-5 py-3 text-xs text-text-secondary">{task.dueDate}</td>
              <td className="px-5 py-3 text-xs font-medium">
                <span className={cn(statusStyles[task.status])}>{task.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
