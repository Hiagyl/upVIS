const bcrypt = require("bcryptjs");
const Scholar = require("../../models/v1/Scholar");
const Member = require("../../models/v1/members");

class ApprovalEffectsService {
  async executeApprovalEffect(application) {
    if (application.type === "student_scholarship") {
      return await this.handleScholarshipApproval(application);
    }

    if (application.type === "student_account") {
      return await this.handleStudentAccountApproval(application);
    }

    if (application.type === "admin_account") {
      return await this.handleAdminAccountApproval(application);
    }

    throw new Error(`Unsupported application type: ${application.type}`);
  }

  async handleScholarshipApproval(application) {
    const { fullName, email, contactNo, details = {} } = application;
    const { studentNumber, program } = details;

    let scholar = await Scholar.findOne({
      $or: [{ upMail: email }, { studentNumber }],
    });

    if (!scholar) {
      scholar = new Scholar({
        name: fullName,
        upMail: email,
        contactNo,
        studentNumber,
        program,
        scholarshipStartDate: new Date(),
        // Current Scholar schema still requires a password even though
        // scholarship approval should not create a login account.
        password: await this.generateTemporaryPasswordHash(),
        applicationId: application._id,
      });
    } else {
      scholar.name = scholar.name || fullName;
      scholar.upMail = scholar.upMail || email;
      scholar.contactNo = contactNo || scholar.contactNo;
      scholar.program = program || scholar.program;
      scholar.applicationId = application._id;
    }

    await scholar.save();

    application.linkedAccountId = scholar._id;
    application.linkedAccountType = "Scholar";
    await application.save();

    return {
      id: scholar._id,
      model: "Scholar",
      action: "created_or_updated",
    };
  }

  async handleStudentAccountApproval(application) {
    const { fullName, email, contactNo, details = {} } = application;
    const { studentNumber = "", program = "" } = details;

    let member = await Member.findOne({ email });

    if (!member) {
      member = new Member({
        fullname: fullName,
        email,
        contactNo,
        studentNumber,
        program,
        password: await this.generateTemporaryPasswordHash(),
        status: "active",
        role: "member",
        applicationId: application._id,
      });
    } else {
      member.fullname = fullName || member.fullname;
      member.contactNo = contactNo || member.contactNo;
      member.studentNumber = studentNumber || member.studentNumber;
      member.program = program || member.program;
      member.status = "active";
      member.applicationId = application._id;
    }

    await member.save();

    application.linkedAccountId = member._id;
    application.linkedAccountType = "Member";
    await application.save();

    return {
      id: member._id,
      model: "Member",
      action: "created_or_updated",
      role: member.role,
    };
  }

  async handleAdminAccountApproval(application) {
    const { fullName, email, contactNo } = application;

    let member = await Member.findOne({ email });

    if (!member) {
      member = new Member({
        fullname: fullName,
        email,
        contactNo,
        password: await this.generateTemporaryPasswordHash(),
        status: "active",
        role: "admin",
        applicationId: application._id,
      });
    } else {
      member.fullname = fullName || member.fullname;
      member.contactNo = contactNo || member.contactNo;
      member.status = "active";
      member.role = "admin";
      member.applicationId = application._id;
    }

    await member.save();

    application.linkedAccountId = member._id;
    application.linkedAccountType = "Member";
    await application.save();

    return {
      id: member._id,
      model: "Member",
      action: "created_or_updated",
      role: member.role,
    };
  }

  async generateTemporaryPasswordHash() {
    const tempPassword = Math.random().toString(36).slice(-12);
    return await bcrypt.hash(tempPassword, 10);
  }
}

module.exports = new ApprovalEffectsService();
