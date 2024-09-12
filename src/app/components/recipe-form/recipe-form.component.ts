import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeService.getRecipe(+id).subscribe(
        (recipe) => this.populateForm(recipe),
        (error) => console.error('Error loading recipe', error)
      );
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  addInstruction(): void {
    this.instructions.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }

  populateForm(recipe: Recipe): void {
    this.recipeForm.patchValue({
      name: recipe.name,
      description: recipe.description
    });

    recipe.ingredients.forEach(ingredient => {
      this.ingredients.push(this.fb.control(ingredient, Validators.required));
    });

    recipe.instructions.forEach(instruction => {
      this.instructions.push(this.fb.control(instruction, Validators.required));
    });
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const recipe: Recipe = this.recipeForm.value;
      if (this.isEditMode) {
        const id = this.route.snapshot.paramMap.get('id');
        this.recipeService.updateRecipe(+id!, recipe).subscribe(
          () => this.router.navigate(['/recipes']),
          (error) => console.error('Error updating recipe', error)
        );
      } else {
        this.recipeService.createRecipe(recipe).subscribe(
          () => this.router.navigate(['/recipes']),
          (error) => console.error('Error creating recipe', error)
        );
      }
    }
  }
}