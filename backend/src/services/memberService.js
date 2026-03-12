const Member = require("../models/Members");

const memberService = {
  getAll: async () => {
    return await Member.find();
  },

  getById: async (memberID) => {
    return await Member.findOne({ memberID });
  },

  create: async (data) => {
    // Business logic: check for existing ID
    const existing = await Member.findOne({ memberID: data.memberID });
    if (existing) {
      throw new Error("Member ID already exists");
    }

    const newMember = new Member(data);
    return await newMember.save();
  },

  update: async (memberID, updateData) => {
    return await Member.findOneAndUpdate({ memberID }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  delete: async (memberID) => {
    return await Member.findOneAndDelete({ memberID });
  },
};

module.exports = memberService;
