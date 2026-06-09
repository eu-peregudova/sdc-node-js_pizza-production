import { IngredientRepository } from '../repositories/ingredientRepository.js';

export class IngredientService {
  private repository: IngredientRepository;

  constructor(repository?: IngredientRepository) {
    this.repository = repository || new IngredientRepository();
  }

  async checkIngredientAvailability(ingredientId: string): Promise<string> {
    try {
      const ingredient = await this.repository.getIngredientById(ingredientId);
      return ingredient.units;
    } catch (err) {
      throw err;
    }
  }
}
