export type PaginationOutputDto<Item = any> = {
  items: Item[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};

export type PaginationOuputProps<Item> = {
  items: Item[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    props: PaginationOuputProps<Item>
  ): PaginationOutputDto<Item> {
    return {
      items: props.items,
      total: props.total,
      current_page: props.current_page,
      last_page: props.last_page,
      per_page: props.per_page,
    };
  }
}
