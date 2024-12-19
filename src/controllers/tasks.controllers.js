import Task from "../model/Task";

// Renderizar las tareas activas
export const renderTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ estado: 1 }).lean(); // Solo tareas activas
    res.render("index", { tasks });
  } catch (error) {
    console.log({ error });
    return res.render("error", { errorMessage: error.message });
  }
};

// Crear una nueva tarea con estado activo por defecto
export const createTask = async (req, res, next) => {
  try {
    const task = new Task({ ...req.body, estado: 1 }); // Estado activo por defecto
    await task.save();
    res.redirect("/");
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};

// Alternar el estado "done" de una tarea
export const taskToggleDone = async (req, res, next) => {
  let { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task || task.estado === 0) {
      throw new Error("Tarea no encontrada o inactiva");
    }
    task.done = !task.done;
    await task.save();
    res.redirect("/");
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};

// Renderizar la edición de una tarea
export const renderTaskEdit = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).lean();
    if (!task || task.estado === 0) {
      throw new Error("Tarea no encontrada o inactiva");
    }
    res.render("edit", { task });
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};

// Editar una tarea existente
export const editTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, estado: 1 }, // Solo editar si está activa
      req.body
    );
    if (!task) {
      throw new Error("Tarea no encontrada o inactiva");
    }
    res.redirect("/");
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};

// Eliminación lógica de una tarea
export const deleteTask = async (req, res, next) => {
  let { id } = req.params;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, estado: 1 }, // Solo eliminar si está activa
      { estado: 0 }
    );
    if (!task) {
      throw new Error("Tarea no encontrada o ya eliminada");
    }
    res.redirect("/");
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};

// Restaurar una tarea eliminada (opcional)
export const restoreTask = async (req, res, next) => {
  let { id } = req.params;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, estado: 0 }, // Solo restaurar si está inactiva
      { estado: 1 }
    );
    if (!task) {
      throw new Error("Tarea no encontrada o ya restaurada");
    }
    res.redirect("/");
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};