import { Request, Response } from "express";
import Lead from "../models/Lead";

// Post /leads
export const createLead = async (req: Request, res: Response) => {
  try {
    const { full_name, phone, email, text, source } = req.body;

    // יצירת ליד חדש על סמך הנתונים שהתקבלו
    const newLead = new Lead({
      full_name,
      phone,
      email,
      text,
      source: source || "website", // אם המקור לא סופק, נניח שהוא מהאתר
      status: "new", // סטטוס ברירת מחדל לליד חדש
    });

    // שמירת הליד במסד הנתונים
    const savedLead = await newLead.save();

    // שליחת תגובה עם הליד שנוצר
    res
      .status(201)
      .json({ message: "Lead created successfully", lead: savedLead });
  } catch (error: any) {
    // טיפול בשגיאות
    console.error("Error creating lead:", error);
    res
      .status(500)
      .json({ message: "Failed to create lead", error: error.message });
  }
};

// GET /leads
export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find();
    res.status(200).json({ leads });
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch leads", error: error.message });
  }
};
