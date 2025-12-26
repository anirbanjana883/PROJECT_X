import { object, string, number, z, TypeOf } from "zod";

export const saveSessionSchema = object({
  body: object({
    assignmentId: string()
      .trim()
      .optional(),

    
    gameId: string()
      .trim()
      .min(1, "Game ID is required"),

    gameName: string()
      .trim()
      .min(1, "Game Name is required"),

    
    startTime: string().datetime({ message: "Invalid start time format" }),
    endTime: string().datetime({ message: "Invalid end time format" }),
    
    durationSeconds: number()
      .min(0, "Duration cannot be negative"),

    score: number().default(0),
    
    accuracy: number()
      .min(0, "Accuracy cannot be less than 0%")
      .max(100, "Accuracy cannot be more than 100%"),

    status: z.enum(["completed", "aborted", "failed"]),

    // Flexible data container for game-specific stats
    performanceData: z
      .record(z.string(), z.unknown())
      .optional(),
  }).strict(),
}).superRefine(({ body }, ctx) => {
  // Logic: End Time must be AFTER Start Time
  const start = new Date(body.startTime);
  const end = new Date(body.endTime);

  if (end <= start) {
    ctx.addIssue({
      path: ["body", "endTime"],
      message: "End time must be after start time",
      code: "custom",
    });
  }
});

export type SaveSessionInput = TypeOf<typeof saveSessionSchema>["body"];