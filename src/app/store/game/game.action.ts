import { SwapiType } from "src/app/enums/swapiType.enum";

export class FetchPeopleData {
  static readonly type = '[Game] Fetch People Data';
}

export class FetchStarshipsData {
  static readonly type = '[Game] Fetch Starships Data';
}

export class SetGameMode {
  static readonly type = '[Game] Set Game Mode';
  constructor(public mode: SwapiType) { }
}