import { z } from "zod";

const isoRegex = /^\d{4}-\d{2}-\d{2}$/; // yyyy-MM-dd

function parseISOToDate(iso: string): Date | null {
  if (!isoRegex.test(iso)) return null;
  const [yyyy, mm, dd] = iso.split("-").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  // valida consistência (ex.: 2025-02-31 inválido)
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return null;
  }
  return date;
}

export const GetHeartbeatSchema = z
  .object({
    from: z.string().regex(isoRegex, "Formato inválido, use yyyy-MM-dd"),
    to: z.string().regex(isoRegex, "Formato inválido, use yyyy-MM-dd"),
  })
  .superRefine((data, ctx) => {
    const fromDate = parseISOToDate(data.from);
    const toDate = parseISOToDate(data.to);

    if (!fromDate) {
      ctx.addIssue({
        path: ["from"],
        code: z.ZodIssueCode.custom,
        message: "Data inicial inválida",
      });
    }

    if (!toDate) {
      ctx.addIssue({
        path: ["to"],
        code: z.ZodIssueCode.custom,
        message: "Data final inválida",
      });
    }

    if (fromDate && toDate && fromDate > toDate) {
      ctx.addIssue({
        path: ["from"],
        code: z.ZodIssueCode.custom,
        message: "A data inicial não pode ser maior que a data final",
      });
    }
  });

export type GetHeartbeatSchemaZod = z.infer<typeof GetHeartbeatSchema>;
