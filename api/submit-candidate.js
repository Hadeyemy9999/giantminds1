const fs = require('fs');
const formidable = require('formidable');
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
    const { name, email, phone, career_field, career_goals } = fields;
    const resumeFile = files?.resume;

    if (!name || !email || !career_field || !career_goals || !resumeFile) {
      return res.status(400).send('Missing required candidate fields or resume upload.');
    }

    const resumePath = resolveFilePath(resumeFile);
    if (!resumePath) {
      return res.status(400).send('Invalid resume upload.');
    }

    const resumeBuffer = await fs.promises.readFile(resumePath);

    await sendCandidateEmail({
      name,
      email,
      phone,
      career_field,
      career_goals,
      file: {
        originalname: resumeFile.originalFilename || resumeFile.newFilename || resumeFile.name,
        buffer: resumeBuffer,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Vercel candidate email error:', error);
    return res.status(500).send(`Failed to send candidate submission email: ${error.message}`);
  }
};
