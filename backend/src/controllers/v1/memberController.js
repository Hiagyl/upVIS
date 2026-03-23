const memberService = require('../../services/v1/memberService');

const memberController = {
    // GET all members
    getMembers: async (req, res) => {
        try {
            const members = await memberService.getAll();
            res.json(members);
        } catch (error) {
            res.status(500).json({ message: "Error fetching members", error: error.message });
        }
    },

    
    getMember: async (req, res) => {
        try {
            const member = await memberService.getById(req.params.id);
            if (!member) return res.status(404).json({ message: "Member not found" });
            res.json(member);
        } catch (error) {
            res.status(500).json({ message: "Error fetching member", error: error.message });
        }
    },

    createMember: async (req, res) => {
        try {
            const newMember = await memberService.create(req.body);
            res.status(201).json(newMember);
        } catch (error) {
            res.status(400).json({ message: "Error creating member", error: error.message });
        }
    },

    updateMember: async (req, res) => {
        try {
            const updated = await memberService.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ message: "Member not found" });
            res.json(updated);
        } catch (error) {
            res.status(400).json({ message: "Error updating member", error: error.message });
        }
    },

    deleteMember: async (req, res) => {
        try {
            const deleted = await memberService.delete(req.params.id);
            if (!deleted) return res.status(404).json({ message: "Member not found" });
            res.json({ message: "Member deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting member", error: error.message });
        }
    }
};

module.exports = memberController;