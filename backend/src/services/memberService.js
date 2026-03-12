const Member = require('../models/Members');

const memberService = {
    getAll: async () => {
        return await Member.find().sort({ joinDate: -1 });
    },

    getById: async (id) => {
        return await Member.findById(id);
    },

    create: async (data) => {
        const member = new Member(data);
        return await member.save();
    },

    update: async (id, data) => {
        return await Member.findByIdAndUpdate(id, data, {
            new: true, // returns the updated document
            runValidators: true // ensures enum/required checks run on update
        });
    },

    delete: async (id) => {
        return await Member.findByIdAndDelete(id);
    }
};

module.exports = memberService;