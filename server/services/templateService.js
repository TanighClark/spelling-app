//# fetches template metadata
// server/services/templateService.js
import Template from '../models/Template.js';
import cache from '../utils/cache.js';

/**
 * Fetch all templates for a user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
export async function getUserTemplates(userId) {
  const cacheKey = `templates:${userId}`;
  let templates = await cache.get(cacheKey);

  if (!templates) {
    templates = await Template.find({ userId }).lean();
    await cache.set(cacheKey, templates, 3600); // Cache for 1 hour
  }

  return templates;
}

/**
 * Fetch a single template by ID
 * @param {String} templateId
 * @returns {Promise<Object|null>}
 */
export async function getTemplateById(templateId) {
  return Template.findById(templateId).lean();
}

/**
 * Create a new template
 * @param {Object} templateData
 * @returns {Promise<Object>}
 */
export async function createTemplate(templateData) {
  const newTemplate = new Template(templateData);
  await newTemplate.save();

  // Invalidate user templates cache
  const cacheKey = `templates:${templateData.userId}`;
  await cache.del(cacheKey);

  return newTemplate;
}

/**
 * Update an existing template
 * @param {String} templateId
 * @param {Object} updateData
 * @returns {Promise<Object|null>}
 */
export async function updateTemplate(templateId, updateData) {
  const updatedTemplate = await Template.findByIdAndUpdate(
    templateId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (updatedTemplate) {
    await cache.del(`templates:${updatedTemplate.userId}`);
  }

  return updatedTemplate;
}

/**
 * Delete a template
 * @param {String} templateId
 * @returns {Promise<Object|null>}
 */
export async function deleteTemplate(templateId) {
  const deletedTemplate = await Template.findByIdAndDelete(templateId);

  if (deletedTemplate) {
    await cache.del(`templates:${deletedTemplate.userId}`);
  }

  return deletedTemplate;
}
