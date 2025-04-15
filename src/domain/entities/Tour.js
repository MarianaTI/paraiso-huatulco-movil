class Tour {
  constructor(
    _id,
    product_code,
    code,
    name,
    name_en,
    short_description,
    short_description_en,
    description,
    description_en,
  ) {
    this._id = _id;
    this.product_code = product_code;
    this.code = code;
    this.name = name;
    this.name_en = name_en;
    this.short_description = short_description;
    this.short_description_en = short_description_en;
    this.description = description;
    this.description_en = description_en;
  }
}

export default Tour;
