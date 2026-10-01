import { settingsService } from "./settings.service";
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateSettingsInput,
  DeleteAccountInput,
} from "./settings.model";

class SettingsController {
  async getSettings({ authUser }: { authUser: { id: string; role: string } }) {
    const settings = await settingsService.getSettings(authUser.id);
    return {
      success: true,
      data: { settings },
    };
  }

  async updateSettings({
    authUser,
    body,
  }: {
    authUser: { id: string; role: string };
    body: UpdateSettingsInput;
  }) {
    const settings = await settingsService.updateSettings(authUser.id, body);
    return {
      success: true,
      message: "Workspace settings updated successfully.",
      data: { settings },
    };
  }

  async updateProfile({
    authUser,
    body,
  }: {
    authUser: { id: string; role: string };
    body: UpdateProfileInput;
  }) {
    const user = await settingsService.updateProfile(authUser.id, body);
    return {
      success: true,
      message: "Profile details updated successfully.",
      data: { user },
    };
  }

  async changePassword({
    authUser,
    body,
  }: {
    authUser: { id: string; role: string };
    body: ChangePasswordInput;
  }) {
    const result = await settingsService.changePassword(authUser.id, body);
    return {
      success: true,
      message: result.message,
    };
  }

  async exportData({ authUser }: { authUser: { id: string; role: string } }) {
    const exportPayload = await settingsService.exportData(authUser.id);
    return {
      success: true,
      data: exportPayload,
    };
  }

  async deleteAccount({
    authUser,
    body,
  }: {
    authUser: { id: string; role: string };
    body: DeleteAccountInput;
  }) {
    const result = await settingsService.deleteAccount(authUser.id, body);
    return {
      success: true,
      message: result.message,
    };
  }
}

export const settingsController = new SettingsController();
