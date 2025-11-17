import { useState } from "react";
import { Box, TextField, Button, Card, CardContent, Typography, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Chip, AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import { Check, Delete, Edit, Add } from "@mui/icons-material";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleAdd = () => {
    if (!input.trim()) return;

    if (editingId) {
      setTasks(tasks.map(task => task.id === editingId ? { ...task, text: input } : task));
      setEditingId(null);
    } else {
      setTasks([{ 
        id: Date.now(), 
        text: input, 
        completed: false,
        createdAt: new Date().toLocaleDateString()
      }, ...tasks]);
    }
    setInput("");
  };

  const handleDelete = (id) => setTasks(tasks.filter(task => task.id !== id));
  const handleComplete = (id) => setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  const handleEdit = (id) => {
    const task = tasks.find(task => task.id === id);
    setInput(task.text);
    setEditingId(id);
  };
  const handleKeyPress = (e) => e.key === "Enter" && handleAdd();
  const clearCompleted = () => setTasks(tasks.filter(task => !task.completed));

  const filteredTasks = tasks.filter(task => 
    filter === "active" ? !task.completed : 
    filter === "completed" ? task.completed : true
  );

  const activeTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: { xs: 2, sm: 4 }, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 600, p: 3, borderRadius: 3, boxShadow: 3 }}>
        
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center" color="primary">Todo List</Typography>

        {/* Stats */}
        <Box display="flex" gap={1} mb={2} justifyContent="center" flexWrap="wrap">
          <Chip label={`Total: ${tasks.length}`} variant="outlined" />
          <Chip label={`Active: ${activeTasksCount}`} color="primary" variant="outlined" />
          <Chip label={`Completed: ${completedTasksCount}`} color="success" variant="outlined" />
        </Box>

        
        <Box display="flex" gap={2} mb={3}>
          <TextField fullWidth label="Enter a task" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} variant="outlined" />
          <Button variant="contained" onClick={handleAdd} sx={{ px: 4, borderRadius: 2 }} startIcon={<Add />}>
            {editingId ? "Update" : "Add"}
          </Button>
        </Box>

      
        <AppBar position="static" sx={{ mb: 2, borderRadius: 2 }}>
          <Toolbar sx={{ minHeight: '48px!important' }}>
            <Tabs value={filter} onChange={(e, newValue) => setFilter(newValue)} textColor="inherit" sx={{ width: '100%' }}>
              <Tab value="all" label="All" />
              <Tab value="active" label="Active" />
              <Tab value="completed" label="Completed" />
            </Tabs>
          </Toolbar>
        </AppBar>

        
        {completedTasksCount > 0 && (
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="outlined" color="error" onClick={clearCompleted} size="small">Clear Completed ({completedTasksCount})</Button>
          </Box>
        )}

      
        <List>
          {filteredTasks.length === 0 && (
            <Typography textAlign="center" color="gray" sx={{ py: 4 }}>
              {filter === "all" ? "No tasks yet. Add one!" : `No ${filter} tasks found.`}
            </Typography>
          )}

          {filteredTasks.map((task) => (
            <Card key={task.id} sx={{ mb: 2, borderRadius: 2, background: task.completed ? "#e8f5e8" : "white", transition: "0.3s", border: task.completed ? "1px solid #4caf50" : "1px solid #e0e0e0", "&:hover": { transform: "translateY(-2px)", boxShadow: 2 } }}>
              <CardContent sx={{ py: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={task.text}
                    secondary={`Created: ${task.createdAt}`}
                    primaryTypographyProps={{ sx: { textDecoration: task.completed ? "line-through" : "none", fontSize: "1.05rem", color: task.completed ? "text.secondary" : "text.primary", fontWeight: task.completed ? "normal" : "medium" } }}
                    secondaryTypographyProps={{ sx: { fontSize: "0.75rem", color: "text.disabled" } }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleComplete(task.id)} color={task.completed ? "success" : "default"}><Check /></IconButton>
                    <IconButton onClick={() => handleEdit(task.id)} color="primary"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(task.id)} color="error"><Delete /></IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      </Card>
    </Box>
  );
}