export interface IStarshipModel {
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: number;
  length: number | string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: number;
  MGLT: number;
  cargo_capacity: number;
  consumables: string;
  pilots: string[];
  created: Date;
  edited: Date;
  name: string;
  url: string;
  description: string;
  id: string;
}