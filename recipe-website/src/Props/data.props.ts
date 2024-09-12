export interface RecipeProps {
    recipe_uid: string;
    id: number;
    image: string;
    title: string;
    instructions: string[];
    preparation_time: string;
    serving_method: string;
    Reviews: {review:string}[];
    Category: {name:string}[];
    RecipeHealth: { nutrition_benefit: string; potential_allergies: string; }[];
}

export interface CategoryProps{
    id:number
    name:string
}

export interface ReviewProps{
    id:number
    review:string
    rating:number
}

export interface RecipeHealthProps {
    shelf_life:string;
    nutrition_benefit: string;
    potential_allergies: string;
  }

