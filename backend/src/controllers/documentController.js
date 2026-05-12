const pool = require('../config/database');

exports.uploadDocument = async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Document uploaded successfully! (Demo Mode)',
    data: { id: Math.floor(Math.random() * 1000), file_name: req.file?.filename }
  });
};

exports.getDocuments = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.verifyDocument = async (req, res) => {
  res.json({ success: true, message: 'Document verified' });
};
