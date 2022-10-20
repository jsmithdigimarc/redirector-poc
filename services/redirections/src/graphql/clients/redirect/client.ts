import type { Client as UrqlClient } from "@urql/core";
import type { Redirect, RedirectMeta } from "../../../types";
import { RedirectNotFoundError } from "../../errors";
import { GET_REDIRECT } from "./queries";

export interface Client {
  queries: {
    readRedirect(shortCode: string): Promise<Redirect>;
  };
}

export function Client(client: UrqlClient): Client {
  return {
    queries: {
      async readRedirect(shortCode) {
        const result = await client
          .query(GET_REDIRECT, {
            shortCode,
          })
          .toPromise();

        if (result.error) {
          throw new Error(result.error.toString());
        }

        const redirect: Redirect | null = result.data?.redirectByShortCode;

        if (!redirect) {
          throw new RedirectNotFoundError(shortCode);
        }

        return redirect;
      },
    },
  };
}
