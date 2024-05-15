import { SeRequest } from "./Request";
import { SeResponse } from "./Response";

export type RoutesExports = {
    post: (req: SeRequest, res: SeResponse) => any;
    get: (req: SeRequest, res: SeResponse) => any;
}