import { ShellModel } from '../shell/data-store';

export class ProductCatalogueItemModel {
  price: number;
  salePrice: number;
  image: string;
  squareImage: string;
  showcaseImages: Array<string>;
  name: string;
  style: string;
  relatedProducts: Array<string>;
}

export class ProductCatalogueModel extends ShellModel {
  items: Array<ProductCatalogueItemModel> = [
    new ProductCatalogueItemModel(),
    new ProductCatalogueItemModel(),
    new ProductCatalogueItemModel(),
    new ProductCatalogueItemModel()
  ];

  constructor() {
    super();
  }
}
