import { ListCastMembersUseCase } from "#cast-member/application";
import { CastMember, CastMemberType } from "#cast-member/domain";
import { CastMemberSequelize } from "#cast-member/infra";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CastMemberModel, CastMemberRepository } = CastMemberSequelize;

setupSequelize({ models: [CastMemberModel] });

let repository: CastMemberSequelize.CastMemberRepository;
let useCase: ListCastMembersUseCase.UseCase;

beforeEach(() => {
  repository = new CastMemberRepository(CastMemberModel);
  useCase = new ListCastMembersUseCase.UseCase(repository);
});

describe("ListCastMembersUseCase Integration Tests", () => {
  it("should return output with two cast members ordered by created_at when input is empty", async () => {
    const created_at = new Date();
    const entities = [
      CastMember.fake().aCastMember().withCreatedAt(created_at).build(),
      CastMember.fake()
        .aCastMember()
        .withCreatedAt(new Date(created_at.getTime() + 1000))
        .build(),
    ];
    repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [entities[1].toJSON(), entities[0].toJSON()],
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output with three cast members ordered by created_at when input is empty", async () => {
    const entities = CastMember.fake()
      .theCastMembers(3)
      .withName((index) => `test ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index * 1000))
      .build();
    await repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [...entities].reverse().map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output using paginate, sort and filter", async () => {
    const faker = CastMember.fake().aCastMember();

    const entities = [
      faker.withName("a").withType(CastMemberType.createByCode(2)).build(),
      faker.withName("AAA").withType(CastMemberType.createByCode(1)).build(),
      faker.withName("AaA").withType(CastMemberType.createByCode(1)).build(),
      faker.withName("b").withType(CastMemberType.createByCode(2)).build(),
      faker.withName("c").withType(CastMemberType.createByCode(2)).build(),
    ];
    await repository.bulkInsert(entities);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: { name: "a" },
    });
    expect(output).toMatchObject({
      items: [entities[1], entities[2]].map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: { name: "a" },
    });
    expect(output).toMatchObject({
      items: [entities[0]].map((m) => m.toJSON()),
      total: 3,
      current_page: 2,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: { name: "a" },
    });
    expect(output).toMatchObject({
      items: [entities[0], entities[2]].map((m) => m.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: { type: 2 },
    });
    expect(output).toMatchObject({
      items: [entities[4], entities[3]].map((m) => m.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: { name: "aa", type: 1 },
    });
    expect(output).toMatchObject({
      items: [entities[2], entities[1]].map((m) => m.toJSON()),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });
});
