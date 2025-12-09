import { Request, Response } from "express";
import IssueService from "../../services/Inventory/issue.service";

export default {
  async create(req: Request, res: Response) {
    try {
      const issue = await IssueService.issueItem(req.body);
      res.status(201).json(issue);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const issues = await IssueService.getAllIssues();
    res.json(issues);
  },

  async getById(req: Request, res: Response) {
    const issue = await IssueService.getIssueById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  },

  async delete(req: Request, res: Response) {
    try {
      await IssueService.deleteIssue(req.params.id);
      res.json({ message: "Issue deleted and stock restored" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
