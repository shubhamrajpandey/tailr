import { analyticsService } from "./analytics.service";

export class AnalyticsController {
  async getOverview({ authUser }: { authUser: { id: string; role: string } }) {
    const overview = await analyticsService.getOverview(authUser.id);
    return {
      success: true,
      data: overview,
    };
  }

  async getFunnel({ authUser }: { authUser: { id: string; role: string } }) {
    const funnel = await analyticsService.getFunnel(authUser.id);
    return {
      success: true,
      data: funnel,
    };
  }
}

export const analyticsController = new AnalyticsController();
