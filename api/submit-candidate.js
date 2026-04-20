const fs = require('fs');
const { formidable } = require('formidable');
const { sendCandidateEmail } = require('../services/emailService');

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
    const email = fields.email?.[0] || fields.email;
    const phone = fields.phone?.[0] || fields.phone || '';
    const career_field = fields.career_field?.[0] || fields.career_field;
    const career_goals = fields.career_goals?.[0] || fields.career_goals;
    
    // v3 returns array for files too.
    const resumeFile = files?.resume?.[0] || files?.resume;

    if (!name || !email || !career_field || !career_goals || !resumeFile) {
      return res.status(400).send('Missing required candidate fields or resume upload.');
    }

    let filePayload = null;
    if (resumeFile) {
      const resumePath = resolveFilePath(resumeFile);
      if (!resumePath) {
        return res.status(400).send('Invalid resume upload.');
      }
      filePayload = {
        originalname: resumeFile.originalFilename || resumeFile.newFilename || resumeFile.name,
        buffer: await fs.promises.readFile(resumePath),
      };
    }

    await sendCandidateEmail({
      name,
      email,
      phone,
      career_field,
      career_goals,
      file: filePayload,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Vercel candidate email error:', error);
    return res.status(500).send(`Failed to send candidate submission email: ${error.message}`);
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
