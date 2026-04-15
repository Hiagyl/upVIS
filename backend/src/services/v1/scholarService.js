const Scholar = require('../../models/v1/Scholar');

const scholarService = {
    getAll: async () => {
        return await Scholar.find().sort({ createdAt: -1 });
    },

    create: async (data) => {
        return await Scholar.create(data);
    },

    update: async (id, data) => {
        return await Scholar.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    },

    delete: async (id) => {
        return await Scholar.findByIdAndDelete(id);
    }
};

module.exports = scholarService;