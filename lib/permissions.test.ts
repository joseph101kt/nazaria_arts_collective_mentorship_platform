import { describe, it, expect } from "vitest";
import {
  permissionLevel,
  canReviewAssignment,
  canDispatchAssignment,
  canViewCourse,
  canPostCourseUpdate,
  canCreateMeeting,
  canMessage,
} from "./permissions";

describe("permissionLevel", () => {
  it("collapses pm and associate to staff", () => {
    expect(permissionLevel("pm")).toBe("staff");
    expect(permissionLevel("associate")).toBe("staff");
  });
  it("leaves mentor and mentee as-is", () => {
    expect(permissionLevel("mentor")).toBe("mentor");
    expect(permissionLevel("mentee")).toBe("mentee");
  });
});

describe("canReviewAssignment", () => {
  it("staff can always review", () => {
    expect(
      canReviewAssignment({ id: "u-pm", role: "pm" }, { mentorId: "u-mentor-2" })
    ).toBe(true);
  });
  it("mentor can review only their own mentee's assignment", () => {
    expect(
      canReviewAssignment({ id: "u-mentor-1", role: "mentor" }, { mentorId: "u-mentor-1" })
    ).toBe(true);
    expect(
      canReviewAssignment({ id: "u-mentor-1", role: "mentor" }, { mentorId: "u-mentor-2" })
    ).toBe(false);
  });
  it("mentee can never review", () => {
    expect(
      canReviewAssignment({ id: "u-mentee-1", role: "mentee" }, { mentorId: null })
    ).toBe(false);
  });
});

describe("canDispatchAssignment", () => {
  it("mentor and staff can dispatch, mentee cannot", () => {
    expect(canDispatchAssignment("mentor")).toBe(true);
    expect(canDispatchAssignment("pm")).toBe(true);
    expect(canDispatchAssignment("associate")).toBe(true);
    expect(canDispatchAssignment("mentee")).toBe(false);
  });
});

describe("canViewCourse", () => {
  const course = { menteeId: "u-mentee-1", activeMentorId: "u-mentor-1" };

  it("owner mentee can always view", () => {
    expect(canViewCourse({ id: "u-mentee-1", role: "mentee" }, course)).toBe(true);
  });
  it("non-owner mentee cannot view", () => {
    expect(canViewCourse({ id: "u-mentee-2", role: "mentee" }, course)).toBe(false);
  });
  it("the active mentor can view, an unrelated mentor cannot", () => {
    expect(canViewCourse({ id: "u-mentor-1", role: "mentor" }, course)).toBe(true);
    expect(canViewCourse({ id: "u-mentor-2", role: "mentor" }, course)).toBe(false);
  });
  it("staff can always view", () => {
    expect(canViewCourse({ id: "u-pm", role: "pm" }, course)).toBe(true);
    expect(canViewCourse({ id: "u-assoc", role: "associate" }, course)).toBe(true);
  });
});

describe("canPostCourseUpdate", () => {
  const course = { menteeId: "u-mentee-1" };

  it("only the owner mentee can post an update — even other mentees cannot", () => {
    expect(canPostCourseUpdate({ id: "u-mentee-1", role: "mentee" }, course)).toBe(true);
    expect(canPostCourseUpdate({ id: "u-mentee-2", role: "mentee" }, course)).toBe(false);
  });
  it("no role, not even staff, can post on someone else's course", () => {
    expect(canPostCourseUpdate({ id: "u-pm", role: "pm" }, course)).toBe(false);
    expect(canPostCourseUpdate({ id: "u-mentor-1", role: "mentor" }, course)).toBe(false);
  });
});

describe("canCreateMeeting", () => {
  it("mentee can never create", () => {
    expect(canCreateMeeting("mentee", "own_mentees")).toBe(false);
    expect(canCreateMeeting("mentee", "any")).toBe(false);
  });
  it("mentor can create only for own_mentees scope", () => {
    expect(canCreateMeeting("mentor", "own_mentees")).toBe(true);
    expect(canCreateMeeting("mentor", "any")).toBe(false);
  });
  it("staff can create for any scope", () => {
    expect(canCreateMeeting("pm", "any")).toBe(true);
    expect(canCreateMeeting("associate", "own_mentees")).toBe(true);
  });
});

describe("canMessage", () => {
  it("allows adjacent roles in either direction", () => {
    expect(canMessage("pm", "associate")).toBe(true);
    expect(canMessage("associate", "pm")).toBe(true);
    expect(canMessage("associate", "mentor")).toBe(true);
    expect(canMessage("mentor", "mentee")).toBe(true);
  });
  it("blocks same-rank and skip-level pairs", () => {
    expect(canMessage("mentor", "mentor")).toBe(false);
    expect(canMessage("pm", "mentor")).toBe(false);
    expect(canMessage("pm", "mentee")).toBe(false);
    expect(canMessage("associate", "mentee")).toBe(false);
  });
});