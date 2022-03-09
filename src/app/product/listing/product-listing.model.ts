import { ShellModel } from '../../shell/data-store';

export class ProductItemModel {
  price: number;
  salePrice: number;
  image: string;
  squareImage: string;
  showcaseImages: Array<string>;
  name: string;
  style: string;
  relatedProducts: Array<string>;
}

export class ProductListingModel extends ShellModel {
  items: Array<ProductItemModel> = [
    new ProductItemModel(),
    new ProductItemModel(),
    new ProductItemModel(),
    new ProductItemModel()
  ];

  constructor() {
    super();
  }
}
