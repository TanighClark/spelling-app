// server/controllers/templateController.js
import Template from '../models/Template.js';
import { generatePDF } from '../services/pdfService.js';
import { getTemplateById } from '../services/templateService.js';

// List all templates for the current user
// server/controllers/templateController.js

export const listTemplates = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const filter = userId ? { user: userId } : {};
    const templates = await Template.find(filter).lean();

    // make sure you pass `templates` (and a title) here
    res.render('index', {
      templates,
      title: 'Your Templates',
    });
  } catch (err) {
    next(err);
  }
};

// Show the “New Template” form
export const showNewForm = (req, res) => {
  +res.render('new', {
    title: 'Create New Template', // ← and this
  });
};

// Create a new template
export const createTemplate = async (req, res, next) => {
  try {
    const { title, words, activityType } = req.body;
    await Template.create({
      user: req.user.id,
      title,
      words: words.split(',').map((w) => w.trim()),
      activityType,
    });
    res.redirect('/templates');
  } catch (err) {
    next(err);
  }
};

// Show the “Edit Template” form
export const showEditForm = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id).lean();
    if (!template) {
      return res.status(404).render('error', { message: 'Template not found' });
    }
    -res.render('templates/edit', { template });
    +res.render('edit', {
      template,
      title: `Edit: ${template.title}`,
    });
  } catch (err) {
    next(err);
  }
};

// Update an existing template
export const updateTemplate = async (req, res, next) => {
  try {
    const { title, words, activityType, instructions } = req.body;
    await Template.findByIdAndUpdate(req.params.id, {
      title,
      words: words.split(',').map((w) => w.trim()),
      activityType,
      instructions,
    });
    res.redirect('/templates');
  } catch (err) {
    next(err);
  }
};

// Delete a template
export const deleteTemplate = async (req, res, next) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.redirect('/templates');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /templates/:id/pdf - Generate PDF for a template
 */
export async function generateTemplatePDF(req, res, next) {
  try {
    const { id } = req.params;
    const template = await getTemplateById(id);

    if (!template) {
      return res.status(404).render('error', { message: 'Template not found' });
    }

    try {
      const pdfBuffer = await generatePDF(template);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
}
