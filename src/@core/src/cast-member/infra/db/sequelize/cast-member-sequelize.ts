import {
  Model,
  Table,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";

import {
  CastMember,
  CastMemberRepository as CastMemberRepositoryContract,
  CastMemberType,
} from "#cast-member/domain";
import {
  NotFoundError,
  UniqueEntityId,
  EntityValidationError,
  LoadEntityError,
  SortDirection,
} from "#seedwork/domain";
import { literal, Op } from "sequelize";

export namespace CastMemberSequelize {
  type CastMemberModelProps = {
    id: string;
    name: string;
    type: number;
    created_at: Date;
  };

  @Table({ tableName: "cast_members", timestamps: false })
  export class CastMemberModel extends Model<CastMemberModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.INTEGER() })
    declare type: number;

    @Column({ allowNull: false, type: DataType.DATE(3) })
    declare created_at: Date;

    static factory() {
      const chance: Chance.Chance = require("chance")();
      return new SequelizeModelFactory<CastMemberModel, CastMemberModelProps>(
        CastMemberModel,
        () => ({
          id: chance.guid({ version: 4 }),
          name: chance.word(),
          type: chance.integer({ min: 1, max: 2 }),
          created_at: chance.date(),
        })
      );
    }
  }

  export class CastMemberRepository
    implements CastMemberRepositoryContract.Repository
  {
    sortableFields: string[] = ["name", "created_at"];
    orderBy = {
      mysql: {
        name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
      },
    };

    constructor(private categoryModel: typeof CastMemberModel) {}

    async exists(name: string): Promise<boolean> {
      const model = await this.categoryModel.findOne({ where: { name: name } });

      return model ? true : false;
    }

    async search(
      props: CastMemberRepositoryContract.SearchParams
    ): Promise<CastMemberRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      try {
        const { rows: models, count } =
          await this.categoryModel.findAndCountAll({
            ...this.formatFilter(props.filter),
            ...(props.sort && this.sortableFields.includes(props.sort)
              ? { order: this.formatSort(props.sort, props.sort_dir) }
              : { order: [["created_at", "DESC"]] }),
            offset,
            limit,
          });

        return new CastMemberRepositoryContract.SearchResult({
          items: models.map((m) => CastMemberModelMapper.toEntity(m)),
          current_page: props.page,
          per_page: props.per_page,
          total: count,
          sort: props.sort,
          sort_dir: props.sort_dir,
          filter: props.filter,
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }

    private formatSort(sort: string, sort_dir: SortDirection) {
      const dialect = this.categoryModel.sequelize.getDialect();
      if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
        return this.orderBy[dialect][sort](sort_dir);
      }
      return [[sort, sort_dir]];
    }

    private formatFilter(filter: { name?: string; type?: number }) {
      if (filter?.name && filter?.type) {
        return {
          where: {
            [Op.and]: [
              { name: { [Op.like]: `%${filter.name}%` } },
              { type: { [Op.eq]: filter.type } },
            ],
          },
        };
      }
      if (filter?.name) {
        return { where: { name: { [Op.like]: `%${filter.name}%` } } };
      }
      if (filter?.type) {
        return { where: { type: { [Op.eq]: filter.type } } };
      }
      return null;
    }

    async insert(entity: CastMember): Promise<void> {
      await this.categoryModel.create(entity.toJSON());
    }

    async bulkInsert(entities: CastMember[]): Promise<void> {
      await this.categoryModel.bulkCreate(entities.map((e) => e.toJSON()));
    }

    async findById(id: string | UniqueEntityId): Promise<CastMember> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return CastMemberModelMapper.toEntity(model);
    }

    async findAll(): Promise<CastMember[]> {
      const models = await this.categoryModel.findAll();
      return models.map((m) => CastMemberModelMapper.toEntity(m));
    }

    async update(entity: CastMember): Promise<void> {
      await this._get(entity.id);
      await this.categoryModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);

      await this.categoryModel.destroy({
        where: { id: _id },
      });
    }

    private async _get(id: string): Promise<CastMemberModel> {
      return this.categoryModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
      });
    }
  }

  export class CastMemberModelMapper {
    static toEntity(model: CastMemberModel): CastMember {
      const { id, type, ...otherData } = model.toJSON();

      try {
        return new CastMember(
          { type: CastMemberType.createByCode(type), ...otherData },
          new UniqueEntityId(id)
        );
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }
}
