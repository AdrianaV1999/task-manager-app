import React, { useEffect, useState } from "react";
import {
  getPriorityBadgeColor,
  MENU_OPTIONS,
  priorityStyles,
  TI_CLASSES,
} from "../assets/dummy";
import { Calendar, CheckCircle2, Clock, MoreVertical } from "lucide-react";
import axios from "axios";
import { format, isToday } from "date-fns";
import TaskModal from "./TaskModal";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/tasks";

const TaskItem = ({
  task,
  onRefresh,
  onLogout,
  showCompleteCheckbox = true,
}) => {
  if (!task) return null;

  const initialCompleted = () => {
    const val =
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed;
    return [true, 1, "yes"].includes(val);
  };

  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  useEffect(() => {
    const val =
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed;
    setIsCompleted([true, 1, "yes"].includes(val));
  }, [task?.completed]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return { Authorization: `Bearer ${token}` };
  };

  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityBadgeColor(task.priority)?.split(" ")[0] || "border-gray-300";

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";
    try {
      await axios.put(
        `${API_BASE}/${task.id}/gp`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") handleDelete();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${task._id}/gp`, {
        headers: getAuthHeaders(),
      });
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleSave = async (updatedTaskResponse) => {
    const updatedTask = updatedTaskResponse?.task;

    if (!updatedTask?._id) {
      console.error("Missing task ID");
      return;
    }

    try {
      const payload = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate,
        completed: updatedTask.completed,
      };

      await axios.put(`${API_BASE}/${updatedTask._id}/gp`, payload, {
        headers: getAuthHeaders(),
      });

      onRefresh?.();
      setShowEditModal(false);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout?.();
      } else {
        console.error("Error saving task:", err.message || err);
      }
    }
  };

  const progress = subtasks.length
    ? (subtasks.filter((st) => st.completed).length / subtasks.length) * 100
    : 0;

  return (
    <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
      <div className={TI_CLASSES.leftContainer}>
        {showCompleteCheckbox && (
          <button
            onClick={handleComplete}
            className={`${TI_CLASSES.completeBtn} ${
              isCompleted ? "text-gray-400" : "text-green-500"
            }`}
          >
            <CheckCircle2
              size={18}
              className={`${TI_CLASSES.checkboxIconBase} ${
                isCompleted ? "" : "fill-green-500"
              }`}
            />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <h3
              className={`${TI_CLASSES.titleBase} ${
                isCompleted ? "text-gray-400 line-through" : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className={TI_CLASSES.description}>{task.description}</p>
          )}
        </div>
      </div>
      <div className={TI_CLASSES.rightContainer}>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={TI_CLASSES.menuButton}
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" size={18} />
          </button>
          {showMenu && (
            <div className={TI_CLASSES.menuDropdown}>
              {MENU_OPTIONS.map((opt) => (
                <button
                  key={opt.action}
                  onClick={() => handleAction(opt.action)}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-sky-100 flex items-center gap-2 transition-colors duration-200"
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div
            className={`${TI_CLASSES.dateRow} ${
              task.dueDate && isToday(new Date(task.dueDate))
                ? "text-sky-600"
                : "text-gray-600"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {task.dueDate
              ? isToday(new Date(task.dueDate))
                ? "Today"
                : format(new Date(task.dueDate), "MMM dd")
              : "-"}
          </div>
          <div className={TI_CLASSES.createdRow}>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {task.createAt && !isNaN(new Date(task.createAt))
              ? `Created ${format(new Date(task.createAt), "MMM dd")}`
              : "No date"}
          </div>
        </div>
      </div>
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      ></TaskModal>
    </div>
  );
};

export default TaskItem;
