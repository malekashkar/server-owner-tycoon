interface ISettings {
  token: string;
  ownerId: string;
  modules: string[];
  clientId: string;
}

declare module "*settings.json" {
  const value: ISettings;
  export default value;
}
