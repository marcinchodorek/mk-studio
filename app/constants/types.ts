import { ActionFunction, LoaderFunction, TypedResponse } from "@remix-run/node";

export type UnwrapTypedResponseOrDefault<T, D = T> =
  T extends TypedResponse<infer U> ? U : D;
export type ReturnActionResponse<T extends ActionFunction> = Awaited<
  ReturnType<T>
>;
export type ReturnLoaderResponse<T extends LoaderFunction> =
  UnwrapTypedResponseOrDefault<Awaited<ReturnType<T>>>;
