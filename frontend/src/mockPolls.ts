// mockPolls.ts

export interface MockPoll {
  _id: string;
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
  status: "open" | "closed";
  createdAt: string;
}

export const mockPolls: MockPoll[] = [
  {
    _id: "1",
    title: "Best Project Theme for This Semester",
    description:
      "Choose the project theme you would like to focus on for the semester.",
    options: ["Web Development", "Mobile App", "AI & Machine Learning", "Cybersecurity"],
    startDate: "2026-04-10T08:00:00.000Z",
    endDate: "2026-04-25T23:59:59.000Z",
    status: "open",
    createdAt: "2026-04-09T10:30:00.000Z",
  },
  {
    _id: "2",
    title: "Preferred Study Session Time",
    description: "Vote for the most convenient time for group study sessions.",
    options: ["Morning", "Afternoon", "Evening"],
    startDate: "2026-04-12T08:00:00.000Z",
    endDate: "2026-04-20T23:59:59.000Z",
    status: "open",
    createdAt: "2026-04-11T09:00:00.000Z",
  },
  {
    _id: "3",
    title: "Scholarship Workshop Attendance",
    description: "Will you attend the upcoming scholarship workshop next month?",
    options: ["Yes", "No", "Maybe"],
    startDate: "2026-03-15T08:00:00.000Z",
    endDate: "2026-03-30T23:59:59.000Z",
    status: "closed",
    createdAt: "2026-03-10T14:20:00.000Z",
  },
  {
    _id: "4",
    title: "Favorite Campus Event",
    description:
      "Help us decide which campus event should return next semester.",
    options: ["Sports Fest", "Hackathon", "Talent Show", "Cultural Fair"],
    startDate: "2026-04-01T08:00:00.000Z",
    endDate: "2026-04-18T23:59:59.000Z",
    status: "open",
    createdAt: "2026-03-29T12:15:00.000Z",
  },
  {
    _id: "5",
    title: "Library Improvement Suggestions",
    description:
      "Which improvement would you like to see in the library?",
    options: ["More Study Rooms", "Longer Hours", "More Computers", "Better Wi-Fi"],
    startDate: "2026-02-10T08:00:00.000Z",
    endDate: "2026-02-28T23:59:59.000Z",
    status: "closed",
    createdAt: "2026-02-05T16:45:00.000Z",
  },
];

export const mockPollResults: Record<
  string,
  {
    totalVotes: number;
    results: Record<string, number>;
  }
> = {
  "1": {
    totalVotes: 42,
    results: {
      "Web Development": 12,
      "Mobile App": 8,
      "AI & Machine Learning": 17,
      Cybersecurity: 5,
    },
  },
  "2": {
    totalVotes: 25,
    results: {
      Morning: 6,
      Afternoon: 9,
      Evening: 10,
    },
  },
  "3": {
    totalVotes: 50,
    results: {
      Yes: 30,
      No: 10,
      Maybe: 10,
    },
  },
};

export const mockVotes: Record<
  string,
  {
    selectedOption: string;
  }
> = {
  "1": {
    selectedOption: "AI & Machine Learning",
  },
  "2": {
    selectedOption: "Evening",
  },
};