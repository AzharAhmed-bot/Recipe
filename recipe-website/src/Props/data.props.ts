export interface RecipeProps{
    id:number
    image:string
    title:string
    instruction:string
    preparation_time:string
    serving_method:string
    categord_name:string
    shelf_life:string
    nutrition_benefit:string
    potential_allergies:string
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

