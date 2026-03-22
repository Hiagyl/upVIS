const scholarService = require('../services/scholarService');

const scholarController = {
    getScholars: async (req, res) => {
        try {
            const scholars = await scholarService.getAll();
            res.status(200).json({ success: true, data: scholars });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    createScholar: async (req, res) => {
        try {
            const scholar = await scholarService.create(req.body);
            res.status(201).json({ success: true, data: scholar });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    updateScholar: async (req, res) => {
        try {
            const scholar = await scholarService.update(req.params.id, req.body);
            if (!scholar) return res.status(404).json({ success: false, message: 'Scholar not found' });
            res.status(200).json({ success: true, data: scholar });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    deleteScholar: async (req, res) => {
        try {
            const scholar = await scholarService.delete(req.params.id);
            if (!scholar) return res.status(404).json({ success: false, message: 'Scholar not found' });
            res.status(200).json({ success: true, message: 'Scholar deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = scholarController;