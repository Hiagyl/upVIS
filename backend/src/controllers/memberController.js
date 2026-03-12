const memberService = require("../services/memberService");

class MemberController {
  async getMembers(req, res) {
    try {
      const members = await memberService.getAll();
      res.status(200).json(members);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving members", error: error.message });
    }
  }

  async getMember(req, res) {
    try {
      const member = await memberService.getById(req.params.id);
      if (!member) return res.status(404).json({ message: "Member not found" });
      res.status(200).json(member);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving member", error: error.message });
    }
  }

  async createMember(req, res) {
    try {
      const { memberID, fullname, contactNo } = req.body;
      if (!memberID || !fullname || !contactNo) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newMember = await memberService.create(req.body);
      res
        .status(201)
        .json({ message: "Member created successfully", newMember });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Error creating member" });
    }
  }

  async updateMember(req, res) {
    try {
      const updatedMember = await memberService.update(req.params.id, req.body);
      if (!updatedMember)
        return res.status(404).json({ message: "Member not found" });
      res
        .status(200)
        .json({ message: "Member updated successfully", updatedMember });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error updating member", error: error.message });
    }
  }

  async deleteMember(req, res) {
    try {
      const deletedMember = await memberService.delete(req.params.id);
      if (!deletedMember)
        return res.status(404).json({ message: "Member not found" });
      res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting member", error: error.message });
    }
  }
}

module.exports = new MemberController();
