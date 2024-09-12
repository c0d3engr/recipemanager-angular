import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (recipes) => this.recipes = recipes,
      (error) => console.error('Error loading recipes', error)
    );
  }

  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe(
      () => this.loadRecipes(),
      (error) => console.error('Error deleting recipe', error)
    );
  }
}