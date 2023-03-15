import {
  CastMember,
  CastMemberFakeBuilder,
  CastMemberId,
  CastMemberRepository,
  CastMemberType,
} from "#cast-member/domain";
import { CastMemberSequelize } from "#cast-member/infra";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import _chance from "chance";

const chance = _chance();

const { CastMemberModel, CastMemberModelMapper } = CastMemberSequelize;

describe("CastMemberSequelizeRepository Integration Tests", () => {
  setupSequelize({ models: [CastMemberModel] });

  let repository: CastMemberSequelize.CastMemberRepository;

  beforeEach(async () => {
    repository = new CastMemberSequelize.CastMemberRepository(CastMemberModel);
  });

  it("should insert a new entity", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .withType(CastMemberType.createAnActor())
      .build();
    repository.insert(entity);
    const foundEntity = await repository.findById(entity.id);
    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should find an entity", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .withType(CastMemberType.createAnActor())
      .build();
    repository.insert(entity);
    const category = await repository.findById(entity.id);
    expect(category.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should throw an error when entity has not been found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake id")
    );
    await expect(
      repository.findById("312cffad-1938-489e-a706-643dc9a3cfd3")
    ).rejects.toThrow(
      new NotFoundError(
        "Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3"
      )
    );
  });

  it("should find an entity by Id", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .withType(CastMemberType.createAnActor())
      .build();
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.entityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all cast members", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .withType(CastMemberType.createAnActor())
      .build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toStrictEqual(JSON.stringify([entity]));
  });

  it("should throw error on update when cast member is not found", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .withType(CastMemberType.createAnActor())
      .build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should update a cast member", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .withType(CastMemberType.createAnActor())
      .build();
    await repository.insert(entity);

    entity.update("Mary Doe", CastMemberType.createADirector());
    await repository.update(entity);
    const foundEntity = await repository.findById(entity.id);

    expect(entity.toJSON()).toStrictEqual(foundEntity.toJSON());
  });

  it("should throw error on delete when cast member is not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );

    await expect(
      repository.delete(
        new CastMemberId("e712d467-7625-437c-9803-9ba0c6b499b0")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID e712d467-7625-437c-9803-9ba0c6b499b0`
      )
    );
  });

  it("should delete a cast member", async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(entity);
    await repository.delete(entity.id);

    await expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should not find a cast member by name", async () => {
    expect(await repository.exists("fake name")).toBeFalsy();
  });

  it("should find a cast member by name", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .build();
    await repository.insert(entity);
    expect(await repository.exists("John Doe")).toBeTruthy;
  });

  it("should return search result", async () => {
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .build();
    await repository.insert(entity);
    const result = await repository.search(
      CastMemberRepository.SearchParams.create({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: { name: "Doe" },
      })
    );
    expect(result.items).toHaveLength(1);
  });

  describe("search method", () => {
    it("should only apply paginate when other params are null ", async () => {
      const created_at = new Date();
      const models = await CastMemberModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: "John Doe",
          type: 1,
          created_at: created_at,
        }));

      const spyToEntity = jest.spyOn(CastMemberModelMapper, "toEntity");
      const selectedModels = models.slice(0, 15);
      const entities = selectedModels.map(
        (i) =>
          new CastMember(
            {
              name: i.name,
              type: CastMemberType.createADirector(),
              created_at: i.created_at,
            },
            new CastMemberId(i.id)
          )
      );

      const result = await repository.search(
        CastMemberRepository.SearchParams.create()
      );

      expect(result).toBeInstanceOf(CastMemberRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(result.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      result.items.forEach((item) => {
        expect(item).toBeInstanceOf(CastMember);
        expect(item.id).toBeDefined();
        expect(item.toJSON()).toMatchObject({
          name: "John Doe",
          type: 1,
          created_at: created_at,
        });
      });

      expect(JSON.stringify(result)).toStrictEqual(
        JSON.stringify(
          new CastMemberRepository.SearchResult({
            items: entities,
            total: 16,
            current_page: 1,
            per_page: 15,
            sort: null,
            sort_dir: null,
            filter: null,
          })
        )
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      await CastMemberModel.factory()
        .count(16)
        .bulkCreate((index: number) => ({
          id: chance.guid({ version: 4 }),
          name: `John Doe${index}`,
          type: 1,
          created_at: new Date(created_at.getTime() + 100 * index),
        }));

      const searchOutputActual = await repository.search(
        CastMemberRepository.SearchParams.create()
      );

      [...searchOutputActual.items].reverse().forEach((i, index) => {
        expect(i.name).toBe(`John Doe${index + 1}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TeST")
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .build(),
      ];

      await repository.bulkInsert(castMembers);

      let searchOutputActual = await repository.search(
        CastMemberRepository.SearchParams.create({
          filter: { name: "TEST" },
          page: 1,
          per_page: 2,
        })
      );

      let searchOutputExpected = new CastMemberRepository.SearchResult({
        items: [castMembers[0], castMembers[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: { name: "TEST" },
      });

      expect(searchOutputActual.toJSON()).toMatchObject(
        searchOutputExpected.toJSON()
      );

      searchOutputActual = await repository.search(
        CastMemberRepository.SearchParams.create({
          filter: { name: "TEST" },
          page: 2,
          per_page: 2,
        })
      );

      searchOutputExpected = new CastMemberRepository.SearchResult({
        items: [castMembers[3]],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: { name: "TEST" },
      });

      expect(searchOutputActual.toJSON()).toMatchObject(
        searchOutputExpected.toJSON()
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const items = [
        CastMember.fake().aCastMember().withName("b").build(),
        CastMember.fake().aCastMember().withName("a").build(),
        CastMember.fake().aCastMember().withName("d").build(),
        CastMember.fake().aCastMember().withName("e").build(),
        CastMember.fake().aCastMember().withName("c").build(),
      ];

      await repository.bulkInsert(items);

      const arrange = [
        {
          params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result.toJSON()).toMatchObject(i.result.toJSON());
      }
    });

    describe("should search using filter, sort and paginate", () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName("test")
          .withType(CastMemberType.createADirector())
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("a")
          .withType(CastMemberType.createAnActor)
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TEST")
          .withType(CastMemberType.createADirector())
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("e")
          .withType(CastMemberType.createAnActor())
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TeSt")
          .withType(CastMemberType.createAnActor())
          .build(),
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      const arrange = [
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),

          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
        },
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
        },
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { type: CastMemberType.createADirector().value },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[2], castMembers[0]],
            total: 2,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { type: CastMemberType.createADirector() },
          }),
        },
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: {
              name: "TEST",
              type: CastMemberType.createADirector().value,
            },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[2], castMembers[0]],
            total: 2,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST", type: CastMemberType.createADirector() },
          }),
        },
      ];

      test.each(arrange)(
        "when search_params is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON()).toMatchObject(search_result.toJSON());
        }
      );
    });
  });
});
