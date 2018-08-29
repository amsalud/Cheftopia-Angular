import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingList } from '../shopping-list.model';
import { Ingredient } from '../../shared/ingredient.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-form',
  templateUrl: './shopping-list-form.component.html',
  styleUrls: ['./shopping-list-form.component.css']
})
export class ShoppingListFormComponent implements OnInit {
  @ViewChild('form')
  shoppingListForm: NgForm;
  name: string;
  description: string;
  editMode: boolean = false;
  shoppingListPreview: ShoppingList;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService
  ) {}

  saveItem(form: NgForm) {
    const { value } = form;
    const postData = { name: value.name, description: value.description };

    if (!this.editMode) {
      this.shoppingListService.createShoppingList(postData).subscribe(
        () => {
          this.router.navigate(['../', { relativeTo: this.route }]);
        },
        err => console.log(err)
      );
    }
  }

  generatePreview(form: NgForm) {
    const { name, description, ingredients } = form.value;
    const shoppingListIngredients: Ingredient[] = ingredients;
    this.shoppingListPreview = null;

    if (name.length > 0 || description.length > 0) {
      this.shoppingListPreview = new ShoppingList(
        0,
        name,
        description,
        false,
        shoppingListIngredients
      );
    }
  }

  ngOnInit() {
    // Check for Id in param and switch to edit mode
    const shoppingListId: number = +this.route.snapshot.paramMap.get('id');
    if (shoppingListId) {
      this.shoppingListService.getShoppingListById(shoppingListId).subscribe(
        (shoppinglist: any) => {
          this.shoppingListForm.setValue({
            name: shoppinglist.name,
            description: shoppinglist.description,
            ingredients: shoppinglist.ingredients
          });
          this.editMode = true;
          this.generatePreview(this.shoppingListForm);
        },
        err => console.log(err)
      );
    }
  }
}
