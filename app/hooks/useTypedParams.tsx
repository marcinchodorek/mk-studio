import { z, ZodSchema } from "zod";
import { useParams } from "@remix-run/react";

export default function useTypedParams<Schema extends ZodSchema>(
  schema: Schema,
): z.infer<Schema> {
  const params = useParams();

  return schema.parse(params);
}
