/**
 * @description Food item props
 * @export
 * @interface Item
 */
export interface Item {
  id: number;
  name: string;
  size: 'small' | 'medium' | 'large';
  from: string;
  price: number;
  prices?: Sizes[];
  description: string;
  weight_per_piece: string;
  image: string;
  color: string;
}

interface Sizes {
  size: 'small' | 'medium' | 'large';
  price: number;
}
