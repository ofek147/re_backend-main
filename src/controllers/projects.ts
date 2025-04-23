import { Request, Response } from "express";
import Project from "../models/Project";

// GET /projects
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// GET /projects/:slug
export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

// POST /projects
export const createProject = async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create project", details: err });
  }
};

// PUT /projects/:slug
export const updateProject = async (req: Request, res: Response) => {
  try {
    const updated = await Project.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update project", details: err });
  }
};

// DELETE /projects/:slug
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const deleted = await Project.findOneAndDelete({ slug: req.params.slug }); // Find and delete by slug
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }
    res
      .status(200)
      .json({ deleted: true, message: "Project deleted successfully" }); // Changed status to 200 and added a message
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project", details: err });
  }
};
