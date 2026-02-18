'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, Clock, X, Camera } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Task = {
  id: string;
  name: string;
  assignedTo: string;
  reward: number;
  due: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
};

const statusStyles = {
  pending: 'bg-bg-elevated text-text-muted',
  submitted: 'bg-blue-dim text-blue',
  approved: 'bg-green-dim text-green',
  rejected: 'bg-red-500/10 text-red-500',
};

const statusIcons = {
  pending: Clock,
  submitted: Camera,
  approved: Check,
  rejected: X,
};

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formAssignee, setFormAssignee] = useState('');
  const [formReward, setFormReward] = useState('');
  const [formDue, setFormDue] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data.map((t: any) => ({
          id: t.id,
          name: t.title,
          assignedTo: t.assignedTo || 'Unassigned',
          reward: Number(t.reward),
          due: t.dueDate ? formatDate(t.dueDate) : 'No date',
          status: t.status as Task['status'],
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddTask = async () => {
    if (!formName.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formName,
          assignedTo: formAssignee,
          reward: parseFloat(formReward) || 0,
          dueDate: formDue || undefined,
        }),
      });
      if (!res.ok) return;
      const newTask = await res.json();
      setTasks(prev => [{
        id: newTask.id,
        name: newTask.title,
        assignedTo: newTask.assignedTo || 'Unassigned',
        reward: Number(newTask.reward),
        due: newTask.dueDate ? formatDate(newTask.dueDate) : 'No date',
        status: newTask.status,
      }, ...prev]);
      setFormName(''); setFormAssignee(''); setFormReward(''); setFormDue('');
      setShowForm(false);
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'approved' as const } : t));
        toast.success('Task approved');
      }
    } catch {
      toast.error('Failed to approve task');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'rejected' as const } : t));
        toast.success('Task rejected');
      }
    } catch {
      toast.error('Failed to reject task');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Tasks & Chores</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Tasks & Chores</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Create Task
        </button>
      </div>

      {showForm && (
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 mb-4">
          <h3 className="font-semibold mb-3 text-sm">New Task</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Task name"
              className="bg-bg-elevated border border-border rounded-md px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted">Assignee</label>
                <input
                  type="text"
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  placeholder="Assignee name"
                  className="bg-bg-elevated border border-border rounded-md px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted">Reward</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                  <input
                    type="number"
                    value={formReward}
                    onChange={(e) => setFormReward(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-bg-elevated border border-border rounded-md pl-7 pr-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted">Due</label>
                <input
                  type="text"
                  value={formDue}
                  onChange={(e) => setFormDue(e.target.value)}
                  placeholder="e.g. Today"
                  className="bg-bg-elevated border border-border rounded-md px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleAddTask}
                className="bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-bg-elevated border border-border px-4 py-2 rounded-md text-sm hover:border-border-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {tasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          return (
            <div key={task.id} className="bg-bg-card border border-border rounded-lg p-4 hover:border-border-hover transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${statusStyles[task.status]}`}>
                    <StatusIcon size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{task.name}</p>
                    <p className="text-xs text-text-muted">Assigned to {task.assignedTo} &middot; Due {task.due}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-green">${task.reward.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusStyles[task.status]}`}>{task.status}</span>
                </div>
              </div>
              {task.status === 'submitted' && (
                <div className="flex items-center gap-2 mt-3 ml-11">
                  <button
                    onClick={() => handleApprove(task.id)}
                    className="text-xs bg-green text-black px-3 py-1.5 min-h-[44px] rounded-md font-medium hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(task.id)}
                    className="text-xs bg-red-500/10 text-red-500 px-3 py-1.5 min-h-[44px] rounded-md font-medium hover:bg-red-500/20 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
