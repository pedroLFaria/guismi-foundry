import GuismiActorBase from "./actor-base.mjs";

export default class GuismiCharacter extends GuismiActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.racialTraits =  new fields.SchemaField({
      background: new fields.NumberField({ ...requiredInteger, initial: 0}),
      allocated: new fields.NumberField({ ...requiredInteger, initial: 0}),
      bonus: new fields.NumberField({ ...requiredInteger, initial: 0}),
      total: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      Mod10: new fields.NumberField({ ...requiredInteger, initial: 0}),
      Mod5: new fields.NumberField({ ...requiredInteger, initial: 0})
    });
    schema.traits =  new fields.SchemaField({
      background: new fields.NumberField({ ...requiredInteger, initial: 0}),
      allocated: new fields.NumberField({ ...requiredInteger, initial: 0}),
      bonus: new fields.NumberField({ ...requiredInteger, initial: 0}),
      total: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      Mod10: new fields.NumberField({ ...requiredInteger, initial: 0}),
      Mod5: new fields.NumberField({ ...requiredInteger, initial: 0}),
      expertises: new fields.StringField({ required: true, blank: true })
    });
    schema.dailyRegeneration = new fields.SchemaField({
      base: new fields.NumberField({ ...requiredInteger, initial: 0}),
      moddifier: new fields.NumberField({ ...requiredInteger, initial: 0}),
      current: new fields.NumberField({ ...requiredInteger, initial: 0})
    });
    schema.staminaRegeneration = new fields.SchemaField({
      base: new fields.NumberField({ ...requiredInteger, initial: 0}),
      moddifier: new fields.NumberField({ ...requiredInteger, initial: 0}),
      current: new fields.NumberField({ ...requiredInteger, initial: 0})
    });
    schema.manaRegeneration = new fields.SchemaField({
      base: new fields.NumberField({ ...requiredInteger, initial: 0}),
      moddifier: new fields.NumberField({ ...requiredInteger, initial: 0}),
      current: new fields.NumberField({ ...requiredInteger, initial: 0})
    });
    schema.movement = new fields.SchemaField({
      squares: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      meters: new fields.NumberField({ ...requiredInteger, initial: 0 }),
    });
    schema.level = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.experience = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.actionPoints = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.age = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.reflexes = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.willpower = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.fortitude = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.biography = new fields.StringField({ required: true, blank: true });
    schema.affiliation = new fields.StringField({ required: true, blank: true });
    schema.clan = new fields.StringField({ required: true, blank: true });
    schema.birthplace = new fields.StringField({ required: true, blank: true });
    schema.languages = new fields.StringField({ required: true, blank: true });
    schema.ancestry = new fields.StringField({ required: true, blank: true });
    schema.race = new fields.StringField({ required: true, blank: true });
    schema.sanity = new fields.StringField({ required: true, blank: true });
    schema.patron = new fields.StringField({ required: true, blank: true });
    schema.class = new fields.StringField({ required: true, blank: true });
    // Iterate over ability names and create a new SchemaField for each.
    schema.attributes = new fields.SchemaField(Object.keys(CONFIG.GUISMI.attributes).reduce((obj, attribute) => {
      obj[attribute] = new fields.SchemaField({
        background: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
        allocated: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        bonus: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        mod2: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        mod5: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        total: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        label: new fields.StringField({ required: true, blank: true }),
        abbr: new fields.StringField({ required: true, blank: true })
      });
      return obj;
    }, {}));

    return schema;
  }

  prepareDerivedData() {    
    this.prepareAttributes();
    const { str, con, agi, dex, int, wis, cha } = this.attributes;
    
    this.prepareResistances(agi, dex, int, str, con, wis, cha);
    
    this.prepareCombatBoard(con, str, int);
    this.prepareRegenerations(con, agi, wis);
    this.prepareMovement(agi);
  }

  prepareMovement(agi) {
    this.movement.meters = 8 + (agi.total / 5);
    this.movement.squares = Math.ceil(this.movement.meters * 1.5);
  }

  prepareAttributes() {
    for (const key in this.attributes) {
      console.log('prepareDerivedData.' + key, {
        attr: this.attributes[key],
        total: this.attributes[key].total,
      });
      this.attributes[key].total = this.attributes[key].background + this.attributes[key].allocated +
        this.attributes[key].bonus;
      this.attributes[key].mod2 = Math.ceil((this.attributes[key].total) / 2);
      this.attributes[key].mod5 = Math.ceil((this.attributes[key].total) / 2);
      this.attributes[key].label = game.i18n.localize(CONFIG.GUISMI.attributes[key]) ?? key;
      this.attributes[key].abbr = game.i18n.localize(CONFIG.GUISMI.attibuteAbbreviations[key]) ?? key;
    }
  }

  prepareResistances(agi, dex, int, str, con, wis, cha) {
    this.reflexes = Math.ceil((agi.total + dex.total + int.total) / 3);
    this.fortitude = Math.ceil((str.total + con.total + wis.total) / 3);
    this.willpower = Math.ceil((str.total + con.total + agi.total + dex.total + int.total + wis.total + cha.total) / 7);
    this.actionPoints = Math.ceil((str.total + con.total + agi.total + dex.total + int.total + wis.total + cha.total) / 19);
  }

  prepareCombatBoard(con, str, int) {
    this.health.total = 10 + con.total;
    this.health.current = this.health.total - this.health.lost;

    this.stamina.total = 10 + str.total;
    this.stamina.current = this.stamina.total - this.stamina.lost;

    this.mana.total = (int.total) * 5;
    this.mana.current = this.mana.total - this.mana.lost;
  }

  prepareRegenerations(con, agi, wis) {
    console.log('prepareRegenerations', {con, wis});
    this.dailyRegeneration.base = Math.ceil(this.health.total / 2);
    this.dailyRegeneration.current = this.dailyRegeneration.base + this.dailyRegeneration.moddifier;

    this.staminaRegeneration.base = Math.ceil((con.total + agi.total) / 8);
    this.staminaRegeneration.current = this.staminaRegeneration.base + this.staminaRegeneration.moddifier;

    this.manaRegeneration.base = Math.ceil(wis.total / 2);
    this.manaRegeneration.current = this.manaRegeneration.base + this.manaRegeneration.moddifier;
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.attributes) {
      for (let [k,v] of Object.entries(this.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    return data
  }
}