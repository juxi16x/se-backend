import { OutgoingHttpHeaders } from "http";

export type SeResponse = {
  send: (data: any) => void;
  end: () => void;
  render: (filename: string) => void;
  statusCode: (code: number) => void;
  writeHead: (code: number, obj: OutgoingHttpHeaders) => void;
  setHeader: (
    name: string,
    value: number | string | ReadonlyArray<string>
  ) => void;
};
