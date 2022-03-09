import { ShellModel } from '../shell/data-store';

export class SearchItemModel {
  price: number;
  salePrice: number;
  image: string;
  squareImage: string;
  showcaseImages: Array<string>;
  name: string;
  style: string;
  relatedProducts: Array<string>;
}

export class SearchProductModel extends ShellModel {
  items: Array<SearchItemModel> = [
    new SearchItemModel(),
    new SearchItemModel(),
    new SearchItemModel(),
    new SearchItemModel()
  ];

  constructor() {
    super();
  }
}
