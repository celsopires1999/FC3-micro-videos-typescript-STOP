import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";

import {
  Category,
  CategoryId,
  CategoryRepository as CategoryRepositoryContract,
} from "#category/domain";
import {
  EntityValidationError,
  LoadEntityError,
  NotFoundError,
  SortDirection,
} from "#seedwork/domain";
import { literal, Op } from "sequelize";

export namespace CategorySequelize {
  type CategoryModelProps = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
  };

  @Table({ tableName: "categories", timestamps: false })
  export class CategoryModel extends Model<CategoryModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE(3) })
    declare created_at: Date;

    static factory() {
      const chance: Chance.Chance = require("chance")();
      return new SequelizeModelFactory<CategoryModel, CategoryModelProps>(
        CategoryModel,
        () => ({
          id: chance.guid({ version: 4 }),
          name: chance.word(),
          description: chance.paragraph(),
          is_active: true,
          created_at: chance.date(),
        })
      );
    }
  }

  export class CategoryRepository
    implements CategoryRepositoryContract.Repository
  {
    sortableFields: string[] = ["name", "created_at"];
    orderBy = {
      mysql: {
        name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
      },
    };

    constructor(private categoryModel: typeof CategoryModel) {}

    async exists(name: string): Promise<boolean> {
      const model = await this.categoryModel.findOne({ where: { name: name } });

      return model ? true : false;
    }

    async search(
      props: CategoryRepositoryContract.SearchParams
    ): Promise<CategoryRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      const { rows: models, count } = await this.categoryModel.findAndCountAll({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: this.formatSort(props.sort, props.sort_dir) }
          : { order: [["created_at", "DESC"]] }),
        offset,
        limit,
      });
      return new CategoryRepositoryContract.SearchResult({
        items: models.map((m) => CategoryModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        sort: props.sort,
        sort_dir: props.sort_dir,
        filter: props.filter,
      });
    }

    private formatSort(sort: string, sort_dir: SortDirection) {
      const dialect = this.categoryModel.sequelize.getDialect();
      if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
        return this.orderBy[dialect][sort](sort_dir);
      }
      return [[sort, sort_dir]];
    }

    async insert(entity: Category): Promise<void> {
      await this.categoryModel.create(entity.toJSON());
    }

    async bulkInsert(entities: Category[]): Promise<void> {
      await this.categoryModel.bulkCreate(entities.map((e) => e.toJSON()));
    }

    async findById(id: string | CategoryId): Promise<Category> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return CategoryModelMapper.toEntity(model);
    }

    async findAll(): Promise<Category[]> {
      const models = await this.categoryModel.findAll();
      return models.map((m) => CategoryModelMapper.toEntity(m));
    }

    async update(entity: Category): Promise<void> {
      await this._get(entity.id);
      await this.categoryModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    async delete(id: string | CategoryId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);

      await this.categoryModel.destroy({
        where: { id: _id },
      });
    }

    private async _get(id: string): Promise<CategoryModel> {
      return this.categoryModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(id, Category),
      });
    }

    getEntity(): new (...args: any[]) => Category {
      return Category;
    }
  }

  export class CategoryModelMapper {
    static toEntity(model: CategoryModel): Category {
      const { id, ...otherData } = model.toJSON();

      try {
        return new Category(otherData, new CategoryId(id));
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }
}
