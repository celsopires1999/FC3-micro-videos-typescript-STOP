import {
  CastMemberOutput,
  ListCastMembersUseCase,
} from '@fc/micro-videos/cast-member/application';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../../@share/presenters/collection.presenter';

export class CastMemberPresenter {
  id: string;
  name: string;
  type: number;
  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: CastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}
export class CastMemberCollectionPresenter extends CollectionPresenter {
  data: CastMemberPresenter[];

  constructor(output: ListCastMembersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new CastMemberPresenter(item));
  }
}
