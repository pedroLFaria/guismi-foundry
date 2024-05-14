export default class GuismiActorBase extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.health = new fields.SchemaField({
      total: new fields.NumberField({ ...requiredInteger, initial: 0}),
      lost: new fields.NumberField({ ...requiredInteger, initial: 0}),
      current: new fields.NumberField({ ...requiredInteger, initial: 0})
    });
    schema.stamina = new fields.SchemaField({
      total: new fields.NumberField({ ...requiredInteger, initial: 0}),
      lost: new fields.NumberField({ ...requiredInteger, initial: 0}),
      current: new fields.NumberField({ ...requiredInteger, initial: 0})
    });
    schema.mana = new fields.SchemaField({
      total: new fields.NumberField({ ...requiredInteger, initial: 0}),
      lost: new fields.NumberField({ ...requiredInteger, initial: 0}),
      current: new fields.NumberField({ ...requiredInteger, initial: 0})
    });

    return schema;
  }
}