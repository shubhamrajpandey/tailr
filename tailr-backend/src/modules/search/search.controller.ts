import { searchService } from "./search.service";
import type { GlobalSearchQueryInput } from "./search.model";
import type { AuthUserContext } from "../../middleware/auth-guard";

export class SearchController {
  async search({
    authUser,
    query,
  }: {
    authUser: AuthUserContext;
    query: GlobalSearchQueryInput;
  }) {
    const data = await searchService.globalSearch(authUser.id, query);
    return {
      success: true,
      data,
    };
  }
}

export const searchController = new SearchController();
