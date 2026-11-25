// Recipes and ingredients for Warung Kilat. All original names, invented for this game.
// Each dish is a set of ingredients the player must stack on the plate, in any order.
export const INGREDIENTS = [
  { id: 'nasi',   name: 'Nasi',   key: '1', color: '#f5f0dc', dark: '#d8cf9f' },
  { id: 'mie',    name: 'Mie',    key: '2', color: '#ffd94d', dark: '#d9a400' },
  { id: 'telur',  name: 'Telur',  key: '3', color: '#fff6e0', dark: '#f0c040' },
  { id: 'ayam',   name: 'Ayam',   key: '4', color: '#c98a4b', dark: '#8a5a28' },
  { id: 'sayur',  name: 'Sayur',  key: '5', color: '#58b368', dark: '#2f7d3d' },
  { id: 'cabai',  name: 'Cabai',  key: '6', color: '#e5484d', dark: '#a11d21' },
  { id: 'kecap',  name: 'Kecap',  key: '7', color: '#4a2f1d', dark: '#2a1a0e' },
  { id: 'bawang', name: 'Bawang', key: '8', color: '#c9a0dc', dark: '#7d4fa3' },
];

export const ING_BY_ID = Object.fromEntries(INGREDIENTS.map((ing) => [ing.id, ing]));

// Dishes: id, name, ingredients (ids), base points, cook time for the order timer.
export const DISHES = [
  { id: 'nasgor',   name: 'Nasi Goreng Kilat', needs: ['nasi', 'telur', 'ayam', 'kecap'], points: 120, time: 45 },
  { id: 'miegor',   name: 'Mie Goreng Pedas',  needs: ['mie', 'cabai', 'ayam', 'sayur'],  points: 120, time: 45 },
  { id: 'nasitelur', name: 'Nasi Telur Dadar', needs: ['nasi', 'telur', 'bawang'],         points: 80,  time: 38 },
  { id: 'mieayam',  name: 'Mie Ayam Warung',   needs: ['mie', 'ayam', 'sayur', 'bawang'],  points: 110, time: 42 },
  { id: 'nasayur',  name: 'Nasi Sayur Sehat',  needs: ['nasi', 'sayur', 'telur', 'bawang'], points: 100, time: 40 },
  { id: 'miepedas', name: 'Mie Cabai Meledak', needs: ['mie', 'cabai', 'telur', 'kecap'],  points: 130, time: 48 },
];

export const DISH_BY_ID = Object.fromEntries(DISHES.map((dish) => [dish.id, dish]));

// Order of ingredients on the plate is irrelevant; a plate matches when its multiset
// of ingredient ids equals the dish's needs exactly.
export function plateMatches(plate, dish) {
  if (plate.length !== dish.needs.length) return false;
  const have = plate.slice().sort();
  const want = dish.needs.slice().sort();
  return have.every((id, i) => id === want[i]);
}

export function missingIngredients(plate, dish) {
  const have = plate.slice();
  return dish.needs.filter((id) => {
    const at = have.indexOf(id);
    if (at === -1) return true;
    have.splice(at, 1);
    return false;
  });
}
