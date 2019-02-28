import * as ApplicationSettings from "tns-core-modules/application-settings";

export default class ApplicationSettingsService {

  private static APP_SETTINGS_KEYS = {
    USERNAME: "USERNAME",
    SHOW_OWN_MEASUREMENTS: "SHOW_OWN_MEASUREMENTS",
  };

  private _username: string;
  private _showOwnMeasurements: boolean;

  constructor() {
    this._username = ApplicationSettings.getString(ApplicationSettingsService.APP_SETTINGS_KEYS.USERNAME, null);
    this._showOwnMeasurements = ApplicationSettings.getBoolean(ApplicationSettingsService.APP_SETTINGS_KEYS.SHOW_OWN_MEASUREMENTS, false);
  }

  public isShowOwnMeasurements(): boolean {
    return this._showOwnMeasurements;
  }

  public setShowOwnMeasurements(value: boolean): void {
    this._showOwnMeasurements = value;
    ApplicationSettings.setBoolean(ApplicationSettingsService.APP_SETTINGS_KEYS.SHOW_OWN_MEASUREMENTS, value);
  }

  public getUsername(): string {
    return this._username;
  }

  public setUsername(value: string | null): void {
    this._username = value;
    this.setValue(ApplicationSettingsService.APP_SETTINGS_KEYS.USERNAME, value);
  }

  private setValue(key: string, value: string): void {
    value === null ? ApplicationSettings.remove(key) : ApplicationSettings.setString(key, value);
  }
}
