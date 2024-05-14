/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/guismi/templates/actor/parts/actor-features.hbs',
    'systems/guismi/templates/actor/parts/actor-items.hbs',
    'systems/guismi/templates/actor/parts/actor-spells.hbs',
    'systems/guismi/templates/actor/parts/actor-effects.hbs',
    'systems/guismi/templates/actor/parts/actor-attributes.hbs',
    // Item partials
    'systems/guismi/templates/item/parts/item-effects.hbs',
  ]);
};
