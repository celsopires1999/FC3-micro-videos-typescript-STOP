import { CastMember, Types } from "#cast-member/domain";

export type CastMemberOutput = {
  id: string;
  name: string;
  type: Types;
  created_at: Date;
};

export class CastMemberOutputMapper {
  static toOutput(entity: CastMember): CastMemberOutput {
    return entity.toJSON();
  }
}
