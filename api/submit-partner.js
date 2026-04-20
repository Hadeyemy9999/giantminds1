const fs = require('fs');
const { formidable } = require('formidable');
const { sendPartnerEmail } = require('../services/emailService');

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

function resolveFilePath(file) {
  return file?.filepath || file?.filePath || file?.path;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);
    const name = fields.name?.[0] || fields.name;
    const company = fields.company?.[0] || fields.company;
    const email = fields.email?.[0] || fields.email;
    const partner_type = fields.partner_type?.[0] || fields.partner_type;
    const needs = fields.needs?.[0] || fields.needs;

    const documentFile = files?.document?.[0] || files?.document;

    if (!name || !company || !email || !partner_type || !needs) {
      return res.status(400).send('Missing required partner fields.');
    }

    let filePayload = null;
    if (documentFile) {
      const documentPath = resolveFilePath(documentFile);
      if (!documentPath) {
        return res.status(400).send('Invalid document upload.');
      }
      filePayload = {
        originalname: documentFile.originalFilename || documentFile.newFilename || documentFile.name,
        buffer: await fs.promises.readFile(documentPath),
      };
    }

    await sendPartnerEmail({
      name,
      company,
      email,
      partner_type,
      needs,
      file: filePayload,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Vercel partner email error:', error);
    return res.status(500).send(`Failed to send partner submission email: ${error.message}`);
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
